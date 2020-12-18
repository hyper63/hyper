const test = require('tape')
const doc = require('./doc.js')

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

const events = {
  dispatch: () => null
}

test(
  "create cache doc",
  fork(doc.create("store", { hello: "world" }).runWith({svc: mockService, events}))
);

test("get cache doc", fork(doc.get("store", "KEY_1234").runWith({svc: mockService, events })));

test(
  "update cache document",
  fork(doc.update("store", "KEY_1234", { foo: "bar" }).runWith({svc: mockService, events }))
);

test(
  "delete cache document",
  fork(doc.update("store", "KEY_1234").runWith({svc: mockService, events }))
);
