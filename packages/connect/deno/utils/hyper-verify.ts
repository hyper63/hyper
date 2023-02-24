// deno-lint-ignore-file ban-ts-comment
import { crocks, hmac, ms, R } from '../deps.deno.ts'
import { Result } from '../types.ts'
const {
  assoc,
  compose,
  over,
  ifElse,
  lensPath,
  nth,
  split,
  path,
  identity,
} = R
const { of, Left, Right } = crocks.Either

interface Parsed {
  time: number
  sig: string
}

interface Context {
  input: {
    signature: string | Parsed
    payload: Record<string, unknown>
  }
  secret: string
  ttl: string
  computed?: string
}

const splitHyperSignature = over(
  lensPath(['input', 'signature']),
  // @ts-ignore
  compose(
    (pair: Array<string | number>) => ({
      // @ts-ignore
      time: compose(nth(1), split('t='))(nth(0, pair)),
      // @ts-ignore
      sig: compose(nth(1), split('sig='))(nth(1, pair)),
    }),
    split(','),
  ),
)

const createHmacSignature = (ctx: Context) => {
  try {
    return Right(
      assoc(
        'computed',
        hmac(
          'sha256',
          ctx.secret,
          `${(ctx.input.signature as Parsed).time}.${JSON.stringify(ctx.input.payload, null, 0)}`,
          'utf8',
          'hex',
        ),
        ctx,
      ),
    )
  } catch (_e) {
    return Left({
      ok: false,
      msg: 'could not create signature for verification',
    })
  }
}

const compareSignatures = (ctx: Context) =>
  ctx.computed === (ctx.input.signature as Parsed).sig
    ? Right(assoc('authorized', true, ctx))
    : Left({ ok: false, status: 401, message: 'Unauthorized' })

const verifyTimeGap = (delay: string) =>
  ifElse(
    // @ts-ignore
    compose(
      (x: number) => x < 0 || x > (ms(delay) as number),
      (time: number) =>
        new Date().getTime() -
        new Date(time).getTime(),
      path(['input', 'signature', 0]),
    ),
    () =>
      Left({
        ok: false,
        status: 422,
        msg: 'Timestamp not within acceptable range',
      }),
    Right,
  )

const handleSuccess = () => ({ ok: true })

/**
 * Verify a job received from a hyper queue.
 * See https://docs.hyper.io/post-a-jobtask#sz-verifying-jobs-from-hyper-queue
 *
 * @param {string} secret - the secret you provided when creating the queue.
 * your hyper queue adds a signature to all job requests, using this secret.
 * @param {string} ttl - the maximum age of a job, in the case of your worker having a constraint
 * where it should only process jobs if the job was sent within the last 5 minutes
 * @returns - a function that, given the X-HYPER-SIGNATURE and job payload,
 * will verify the signature and payload and return a hyper OK response
 */
export function createHyperVerify(secret: string, ttl?: string) {
  return function (signature: string, payload: unknown): Result {
    return of({ input: { signature, payload }, secret, ttl })
      .map(splitHyperSignature)
      .chain(createHmacSignature)
      .chain(compareSignatures)
      .chain(verifyTimeGap(ttl as string))
      .either(identity, handleSuccess)
  }
}
