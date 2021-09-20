import crocks from "crocks";

const { Async, chain, compose } = crocks;
const identity = (x) => x;

export const $fetch = compose(
  chain(Async.fromPromise(fetch)),
  Async.fromPromise(identity),
);

export const toJSON = (res) =>
  res.ok
    ? Async.fromPromise(res.json.bind(res))()
    : Async.fromPromise(res.json.bind(res))()
      .map((r) => ({ ok: false, status: res.status, ...r }));
//: Async.Resolved({ ok: false, status: res.status })
export const $ = Async;
