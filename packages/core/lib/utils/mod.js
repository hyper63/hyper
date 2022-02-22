import { crocks } from "../../deps.js";
import { HyperErrFrom, isHyperErr } from "./err.js";

const { Async, compose, ReaderT, Either, eitherToAsync } = crocks;

const ReaderAsync = ReaderT(Async);
const { ask, lift } = ReaderAsync;

const { Left, Right } = Either;

const doValidate = (pred, msg) =>
  (value) => pred(value) ? Right(value) : Left({ ok: false, msg });

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
export const apply = (method) =>
  (data) =>
    ask(({ svc }) => {
      return Async.of(data)
        .chain(
          Async.fromPromise((data) => data ? svc[method](data) : svc[method]()),
        )
        .bichain(
          (err) => {
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

export const triggerEvent = (event) =>
  (data) =>
    ask(({ events }) => {
      const payload = { date: new Date().toISOString() };
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
 * Apricot: support both _id and id, incoming, and outgoing
 * Blueberry: support _id incoming, and id and _id outgoing
 */
export const mapId = (doc) => ({
  ...doc,
  id: doc.id || doc._id,
  _id: doc._id || doc.id,
});

export const monitorIdUsage = (method, db) =>
  (doc) => {
    if (doc && doc.id && !doc._id) {
      console.warn(
        `MIGRATION ALERT (${method}) on ${db}: doc with id "${doc.id}" missing _id field`,
      );
    }

    return doc;
  };
