import { crocks } from "../deps.js";

const { ReaderT, Async, map } = crocks;
const { of, ask, lift } = ReaderT(Async);

const addBody = (body) =>
  ask(map(
    (r) => new Request(r, { method: "POST", body: JSON.stringify(body) }),
  )).chain(lift);

const addQueryParams = (params) =>
  ask(map((r) =>
    new Request(`${r.url}?${params}`, {
      headers: r.headers,
    })
  )).chain(lift);

const appendPath = (id) =>
  ask(map((r) =>
    new Request(`${r.url}/${id}`, {
      headers: r.headers,
    })
  )).chain(lift);

const list = (params = {}) =>
  of(params)
    .map((p) => new URLSearchParams(p).toString())
    .chain(addQueryParams);

const add = addBody;
const get = appendPath;
const update = (id, body) =>
  appendPath(id)
    .map((req) =>
      new Request(req, { method: "PUT", body: JSON.stringify(body) })
    );

const remove = (id) =>
  appendPath(id)
    .map((req) => new Request(req, { method: "DELETE" }));

const query = (selector = {}, options = {}) =>
  appendPath("_query")
    .map((req) =>
      new Request(req, {
        method: "POST",
        body: JSON.stringify({ selector, ...options }),
      })
    );

const bulk = (docs) =>
  appendPath("_bulk")
    .map((req) =>
      new Request(req, {
        method: "POST",
        body: JSON.stringify(docs),
      })
    );

const index = (name, fields) =>
  appendPath("_index")
    .map((req) =>
      new Request(req, {
        method: "POST",
        body: {
          index: { fields },
          name,
          type: "json",
        },
      })
    );

const create = () =>
  ask(map((req) => new Request(req, { method: "PUT" }))).chain(lift);

const destroy = (confirm = false) =>
  confirm
    ? ask(map((r) => new Request(r, { method: "DELETE" }))).chain(lift)
    : of({ msg: "not confirmed" });

export default {
  add,
  list,
  get,
  update,
  remove,
  query,
  index,
  bulk,
  create,
  destroy,
};
