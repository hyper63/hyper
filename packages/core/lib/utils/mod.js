import { crocks, isHyperErr } from "../../deps.js";
import { HyperErrFrom } from "./err.js";

const { Async, compose, ReaderT, Either, eitherToAsync } = crocks;

const ReaderAsync = ReaderT(Async);
const { ask, lift, liftFn } = ReaderAsync;

const { Left, Right } = Either;

const doValidate = (pred, msg) => (value) =>
  pred(value) ? Right(value) : Left({ ok: false, msg });

export { liftFn };

export * from "./err.js";

/**
 * takes a predicate function and error message
 * if the predicate function fails then returns an object with an error message
 * if the predicate function passes then the value is passed down the chain
 */
export const is = (fn, msg) =>
  compose(lift, eitherToAsync, doValidate(fn, msg));
/**
 * uses the reader monad to get the environment, in this case a service
 * module and invokes a method on that module passing the data from the
 * pipeline as the arguments
 */
export const apply = (method) => (data) =>
  ask(({ svc }) => {
    return Async.of(data)
      .chain(
        Async.fromPromise((data) => data ? svc[method](data) : svc[method]()),
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
              `Rejected hyper error returned from operation ${method}. Should this have been Resolved?`,
            );
          }
          console.log(err);

          // fuzzy map
          const hyperErr = HyperErrFrom(err);
          return Async.Resolved(hyperErr);
        },
        (res) => {
          if (isHyperErr(res)) {
            console.log(res);
          }

          return Async.Resolved(res);
        },
      );
  }).chain(lift);

export const triggerEvent = (event) => (data) =>
  ask(({ events }) => {
    const payload = { date: new Date().toISOString() };
    if (isHyperErr(data)) {
      payload.ok = false;
      payload.status = data.status;
      payload.msg = data.msg;
    }
    if (data.name) payload.name = data.name;
    if (data.id) payload.id = data.id;
    if (data.type) payload.type = data.type;

    events.dispatch({
      type: event,
      payload,
    });
    return Async.Resolved(data);
  }).chain(lift);

/**
 * constructor for an AsyncReader monad
 */
export const of = ReaderAsync.of;

/**
 * Given the result of a call into a service (data),
 * if legacyGet is enabled, then map the result to
 * the legacyGet shape.
 *
 * Otherwise, map the result to a "hyper shape".
 *
 * NOTE: this isn't full proof, due to conflation of
 * types described in https://github.com/hyper63/hyper/issues/531
 * but it get's us most of the way there, and provides an avenue for adapters
 * to gradually update to a "hyper shape"
 *
 * @param {string} service
 * @returns {AsyncReader}
 */
export const legacyGet = (service) => (data) =>
  ask(({ isLegacyGetEnabled }) => {
    if (isHyperErr(data)) return Async.Resolved(data);

    if (isLegacyGetEnabled) {
      // Can use this to monitor usage of legacy
      console.warn(`LEGACY_GET: ${service}`);
      console.log(data);
      /**
       * If the adapter returned a legacy get shape, just return it.
       * Otherwise, extract the doc from the response to create the legacy get shape.
       *
       * This will allows adapters to independently migrate to return a hyper shape,
       * without breaking legacy for consumers that still want it enabled
       */
      return Async.Resolved(data.doc || data);
    }

    /**
     * If the adapter returned a hyper shape, just return it. Otherwise, create
     * the hyper shape.
     *
     * This will allow adapters to gradually migrate to return hyper shape,
     * without breaking "non-legacy" for consumers that want legacy disabled
     */
    return Async.Resolved(
      data.ok && data.doc ? data : { ok: true, doc: data },
    );
  }).chain(lift);
