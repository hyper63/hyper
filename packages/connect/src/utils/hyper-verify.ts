import crocks from "crocks";
import * as R from "ramda";
import ms from "ms";
import { createHmac } from "crypto";

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
} = R;
const { of, Left, Right } = crocks.Either;

interface Parsed {
  time: number;
  sig: string;
}

interface Context {
  input: {
    signature: string | Parsed;
    payload: Record<string, unknown>;
  };
  secret: string;
  ttl: string;
  computed?: string;
}

const hmac = (alg: "sha256", secret: string, data: string) => {
  const result = createHmac(alg, secret);
  result.update(data);
  return result.digest("hex");
};

const splitHyperSignature = over(
  lensPath(["input", "signature"]),
  compose(
    (pair: Array<string | number>) => ({
      time: compose(nth(1), split("t="))(nth(0, pair)),
      sig: compose(nth(1), split("sig="))(nth(1, pair)),
    }),
    split(","),
  ),
);

const createHmacSignature = (ctx: Context) => {
  try {
    return Right(
      assoc(
        "computed",
        hmac(
          "sha256",
          ctx.secret,
          `${(ctx.input.signature as Parsed).time}.${
            JSON.stringify(ctx.input.payload, null, 0)
          }`,
        ),
        ctx,
      ),
    );
  } catch (_e) {
    return Left({
      ok: false,
      msg: "could not create signature for verification",
    });
  }
};

const compareSignatures = (ctx: Context) =>
  ctx.computed === (ctx.input.signature as Parsed).sig
    ? Right(assoc("authorized", true, ctx))
    : Left({ ok: false, status: 401, message: "Unauthorized" });

const verifyTimeGap = (delay: string) =>
  ifElse(
    compose(
      (x: number) => x < 0 || x > (ms(delay) as number),
      (time: number) =>
        new Date().getTime() -
        new Date(time).getTime(),
      path(["input", "signature", 0]),
    ),
    () =>
      Left({
        ok: false,
        status: 422,
        msg: "Timestamp not within acceptable range",
      }),
    Right,
  );

const handleSuccess = () => ({ ok: true });

/**
 * createHyperVerify is a function that provides applications
 * looking to be hyper queue workers a function that can verify
 * the signature of an incoming worker queue request. This
 * check can let the worker endpoint be secure so that it only
 * accepts incoming jobs from a hyper queue source.
 */

export function createHyperVerify(secret: string, ttl?: string) {
  return function (signature: string, payload: Record<string, unknown>) {
    return of({ input: { signature, payload }, secret, ttl })
      .map(splitHyperSignature)
      .chain(createHmacSignature)
      .chain(compareSignatures)
      .chain(verifyTimeGap(ttl as string))
      .either(identity, handleSuccess);
  };
}
