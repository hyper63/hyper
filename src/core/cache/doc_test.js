const test = require("tape");
const doc = require("./doc");
const Async = require("crocks/Async");

const mockService = {
  createDoc: ({ store, key, doc, ttl }) => Async.of({ ok: true }),
  getDoc: ({ store, key }) => Async.of({ ok: true, doc: { hello: "world" } }),
  updateDoc: ({ store, key, doc }) => Async.of({ ok: true }),
  deleteDoc: ({ store, key }) => Async.of({ ok: true }),
};

const fork = (m) => (t) => {
  t.plan(1);
  m.fork(
    () => t.ok(false),
    () => t.ok(true)
  );
};

test(
  "create cache doc",
  fork(doc.create("store", { hello: "world" }).runWith(mockService))
);

test("get cache doc", fork(doc.get("store", "KEY_1234").runWith(mockService)));

test(
  "update cache document",
  fork(doc.update("store", "KEY_1234", { foo: "bar" }).runWith(mockService))
);

test(
  "delete cache document",
  fork(doc.update("store", "KEY_1234").runWith(mockService))
);
