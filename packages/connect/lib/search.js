import { crocks, R } from "../deps.js";

const { ReaderT, Async, map } = crocks;
const { of, ask, lift } = ReaderT(Async);
const { assoc } = R;

const apply = (fn) => ask(map(fn)).chain(lift);

const create = (fields, storeFields) =>
  apply((req) =>
    new Request(req, {
      method: "PUT",
      body: JSON.stringify({ fields, storeFields }),
    })
  );

const destroy = (confirm = false) =>
  confirm
    ? apply((req) => new Request(req, { method: "DELETE" }))
    : of({ msg: "not confirmed" });

const add = (key, doc) =>
  apply((req) =>
    new Request(req, { method: "POST", body: JSON.stringify({ key, doc }) })
  );

const remove = (key) =>
  apply((req) =>
    new Request(`${req.url}/${key}`, { headers: req.headers, method: "DELETE" })
  );

const get = (key) =>
  apply((req) => new Request(`${req.url}/${key}`, { headers: req.headers }));

const update = (key, doc) =>
  apply((req) =>
    new Request(`${req.url}/${key}`, {
      method: "PUT",
      headers: req.headers,
      body: JSON.stringify(doc),
    })
  );

const query = (query, { fields, filter } = {}) =>
  of({ query })
    .map((body) => fields ? assoc("fields", fields, body) : body)
    .map((body) => filter ? assoc("filter", filter, body) : body)
    .chain((body) =>
      apply(
        (req) =>
          new Request(`${req.url}/_query`, {
            method: "POST",
            headers: req.headers,
            body: JSON.stringify(body),
          }),
      )
    );

const load = (docs) =>
  apply((req) =>
    new Request(`${req.url}/_bulk`, {
      method: "POST",
      headers: req.headers,
      body: JSON.stringify(docs),
    })
  );

export default Object.freeze({
  create,
  destroy,
  add,
  remove,
  get,
  update,
  query,
  load,
});
