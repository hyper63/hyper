import { default as test } from 'tape'
import * as doc from './doc'

const mockService = {
  createDoc: ({ store, key, doc, ttl }) => Promise.resolve({ ok: true }),
  getDoc: ({ store, key }) => Promise.resolve({ ok: true, doc: { hello: "world" } }),
  updateDoc: ({ store, key, doc }) => Promise.resolve({ ok: true }),
  deleteDoc: ({ store, key }) => Promise.resolve({ ok: true }),
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
