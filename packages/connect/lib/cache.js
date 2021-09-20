import { crocks } from "../deps.js";

const { ReaderT, Async, map } = crocks;
const { of, ask, lift } = ReaderT(Async);

// const appendPath = (id) =>
//   ask((fn) =>
//     fn.map(req => new Request(`${req.url}/${id}`, {
//       headers: req.headers,
//     }))
//   ).chain(lift);

const appendPath = (id) =>
  ask(map((req) =>
    new Request(`${req.url}/${id}`, {
      headers: req.headers,
    })
  )).chain(lift);

const create = () =>
  ask(map((req) => new Request(req, { method: "PUT" }))).chain(lift);

const destroy = (confirm = false) =>
  confirm
    ? ask(map((req) => new Request(req, { method: "DELETE" }))).chain(lift)
    : of({ msg: "not confirmed" });

const add = (key, value, ttl) =>
  ask(map((req) =>
    new Request(req, {
      method: "POST",
      body: JSON.stringify({ key, value, ttl }),
    })
  )).chain(lift);

const remove = (key) =>
  appendPath(key)
    .map((req) => new Request(req, { method: "DELETE" }));

const get = appendPath;

const set = (key, value, ttl) =>
  appendPath(key)
    .map((req) =>
      new Request(req, { method: "PUT", body: JSON.stringify(value) })
    )
    .map((req) =>
      ttl
        ? new Request(`${req.url}?${new URLSearchParams({ ttl }).toString()}`, {
          method: "PUT",
          headers: req.headers,
          body: JSON.stringify(value),
        })
        : req
    );

const query = (pattern) =>
  ask((fn) =>
    fn.map((req) =>
      pattern
        ? new Request(
          `${req.url}/_query?${new URLSearchParams({ pattern }).toString()}`,
          {
            method: "POST",
            headers: req.headers,
          },
        )
        : new Request(
          `${req.url}/_query?${
            new URLSearchParams({ pattern: "*" }).toString()
          }`,
          {
            method: "POST",
            headers: req.headers,
          },
        )
    )
  ).chain(lift);

export default {
  create,
  destroy,
  add,
  get,
  remove,
  set,
  query,
};
