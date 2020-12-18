const test = require('tape')
const doc = require('./doc')

const mock = {
  createDocument({ db, id, doc }) {
    return Promise.resolve({ ok: true });
  },
  retrieveDocument({ db, id }) {
    return Promise.resolve({ ok: true });
  },
  updateDocument({ db, id, doc }) {
    return Promise.resolve({ ok: true });
  },
  removeDocument({ db, id }) {
    return Promise.resolve({ ok: true });
  },
};

const fork = (m) => (t) => {
  t.plan(1);
  return m.fork(
    () => t.ok(false),
    () => t.ok(true)
  );
};

const events = {
  dispatch: () => null
}

test(
  "create document",
  fork(doc.create("foo", { hello: "world" }).runWith({ svc: mock, events }))
);
test("get document", fork(doc.get("foo", "1").runWith({ svc: mock, events })));
test(
  "update document",
  fork(doc.update("foo", "1", { id: "1", goodbye: "moon" }).runWith({ svc: mock, events }))
);
test("remove document", fork(doc.remove("foo", "1").runWith({ svc: mock, events })));
