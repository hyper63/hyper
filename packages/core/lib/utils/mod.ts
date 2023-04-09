import { crocks, HyperErr, isHyperErr } from '../../deps.ts'
import { Event } from '../../model.ts'
import type { AwaitedFn, HyperService, ReaderEnvironment } from '../../types.ts'
import { HyperErrFrom } from './err.js'

const { Async, compose, ReaderT, Either, eitherToAsync } = crocks

const AsyncReader = ReaderT(Async)
const { fromPromise } = Async
const { ask, lift } = AsyncReader
const { Left, Right } = Either

const doValidate = <V = unknown>(pred: (val: V) => boolean, msg: string) => (value: V) =>
  pred(value) ? Right(value) : Left(HyperErr(msg))

export * from './err.js'

/**
 * Given a predicate function and error message,
 * return a Resolved AsyncReader or Rejected AsyncReader.
 *
 * If the predicate function returns true, then an Resolved AsyncReader
 * containing the value
 *
 * If the predicate function returns false, then an Rejected AsyncReader containing
 * a HyperErr with the message
 */
export const is = <V = unknown>(
  pred: (val: V) => boolean,
  msg: string,
): () => crocks.AsyncReader<V> =>
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  compose(lift, eitherToAsync, doValidate(pred, msg))

/**
 * uses the reader monad to get the environment, in this case a service
 * module and invokes a method on that module passing the data from the
 * pipeline as the arguments
 *
 * Abandon all hope, ye who strongly type, here.
 *
 * TODO:
 * I could not figure out how to infer the return type based on calling
 * 'method' on 'svc' without duping the string. I'm sure there is a TS way of doing this,
 * but my TS-fu is just not up to snuff
 *
 * For now, this get's us what we need
 */
export const apply = <Service extends HyperService, K extends keyof Service = keyof Service>(
  method: K,
) =>
(input: unknown) =>
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  ask<ReaderEnvironment<Service>, AwaitedFn<Service[K]>>(({ svc }) => {
    return Async.of(input)
      .chain(
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        fromPromise((input) => (input ? svc[method](input) : svc[method]())),
      )
      .bichain(
        (err) => {
          /**
           * A hyper error should be returned in a resolved Promise, but
           * in the case that is returned in a rejected Promise,
           * we log it as a concern, as it probably indicates incorrect handling
           * in the adapter
           */
          if (isHyperErr(err)) {
            console.warn(
              `Rejected hyper error returned from operation ${method as string}. Should this have been Resolved?`,
            )
          }
          console.log(err)
          // fuzzy map
          const hyperErr = HyperErrFrom(err)
          return Async.Resolved(hyperErr)
        },
        (res) => {
          if (isHyperErr(res)) console.log(res)
          return Async.Resolved(res)
        },
      )
  }).chain(lift)

export const triggerEvent = (type: string) => <R>(result: R): crocks.AsyncReader<R> =>
  ask<ReaderEnvironment, R>(({ events }) => {
    const payload: Event['payload'] = { date: new Date().toISOString() }
    if (isHyperErr(result)) {
      payload.ok = false
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      payload.status = result.status
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      payload.msg = result.msg
    }
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    if (result.name) payload.name = result.name
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    if (result.id) payload.id = result.id
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    if (result.type) payload.type = result.type

    events.dispatch({ type: type, payload })

    return Async.Resolved(result)
  }).chain(lift)

/**
 * constructor for an AsyncReader monad
 */
export const of = AsyncReader.of

/**
 * Given the result of a call into a service (data),
 * if legacyGet is enabled, then simply return the result
 * from the adapter
 *
 * Otherwise, map the result to a "hyper shape".
 *
 * NOTE: We will need to update to ports to enforce
 * a hyper shape from get on adapters, then update those
 * in tandem with the adapters
 */
export const legacyGet = <D>(type: string) => (data: D) =>
  ask<ReaderEnvironment, D | { ok: true; doc: D }>(
    ({ isLegacyGetEnabled }: ReaderEnvironment) => {
      if (isHyperErr(data)) return Async.Resolved(data)

      if (isLegacyGetEnabled) {
        // Can use this to monitor usage of legacy
        console.warn(`LEGACY_GET: ${type}`)
        return Async.Resolved(data)
      }

      /**
       * Create the hyper shape.
       */
      return Async.Resolved({ ok: true, doc: data })
    },
  ).chain(lift)
