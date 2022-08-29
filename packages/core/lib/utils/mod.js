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
