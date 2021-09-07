import Reader from "../utils/reader.js";

const addBody = (body) =>
  Reader.ask((req) =>
    new Request(req, { method: "POST", body: JSON.stringify(body) })
  );
const addQueryParams = (params) =>
  Reader.ask((req) =>
    new Request(`${req.url}?${params}`, {
      headers: req.headers,
    })
  );
const appendPath = (id) =>
  Reader.ask((req) =>
    new Request(`${req.url}/${id}`, {
      headers: req.headers,
    })
  );

const list = (params = {}) =>
  Reader.of(params)
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

const create = () => Reader.ask((req) => new Request(req, { method: "PUT" }));

const destroy = (confirm = false) =>
  confirm
    ? Reader.ask((req) => new Request(req, { method: "DELETE" }))
    : Reader.of({ msg: "not confirmed" });

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