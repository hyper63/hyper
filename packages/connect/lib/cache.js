import Reader from "../utils/reader.js";

const appendPath = (id) =>
  Reader.ask((req) =>
    new Request(`${req.url}/${id}`, {
      headers: req.headers,
    })
  );

const create = () => Reader.ask((req) => new Request(req, { method: "PUT" }));

const destroy = (confirm = false) =>
  confirm
    ? Reader.ask((req) => new Request(req, { method: "DELETE" }))
    : Reader.of({ msg: "not confirmed" });

const add = (key, value, ttl) =>
  Reader.ask((req) =>
    new Request(req, {
      method: "POST",
      body: JSON.stringify({ key, value, ttl }),
    })
  );

const remove = (key) =>
  appendPath(key)
    .map((req) => new Request(req, { method: "DELETE" }));

const get = appendPath;

const set = (key, value, ttl) => appendPath(key)
  .map((req) => new Request(req, { method: "PUT", body: JSON.stringify(value) }))
  .map((req) => ttl ? new Request(`${req.url}?${new URLSearchParams({ ttl }).toString()}`, {
    method: 'PUT',
    headers: req.headers,
    body: JSON.stringify(value)
  }) : req)

const query = pattern => Reader.ask(req => pattern
  ? new Request(`${req.url}/_query?${new URLSearchParams({ pattern }).toString()}`, {
    method: 'POST',
    headers: req.headers
  })
  : new Request(`${req.url}/_query?${new URLSearchParams({ pattern: '*' }).toString()}`, {
    method: 'POST',
    headers: req.headers
  })
)

export default {
  create,
  destroy,
  add,
  get,
  remove,
  set,
  query
};