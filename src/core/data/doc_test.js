const test = require("tape");
const doc = require("./doc");
const { Resolved } = require("crocks/Async");

const mock = {
  createDocument({ db, id, doc }) {
    return Resolved({ ok: true });
  },
  retrieveDocument({ db, id }) {
    return Resolved({ ok: true });
  },
  updateDocument({ db, id, doc }) {
    return Resolved({ ok: true });
  },
  removeDocument({ db, id }) {
    return Resolved({ ok: true });
  },
};

const fork = (m) => (t) => {
  t.plan(1);
  return m.fork(
    () => t.ok(false),
    () => t.ok(true)
  );
};

test(
  "create document",
  fork(
    doc.create({ db: "foo", id: "1", doc: { hello: "world" } }).runWith(mock)
  )
);
test("get document", fork(doc.get({ db: "foo", id: "1" }).runWith(mock)));
test(
  "update document",
  fork(
    doc.update({ db: "foo", id: "1", doc: { goodbye: "moon" } }).runWith(mock)
  )
);
test("remove document", fork(doc.remove({ db: "foo", id: "1" }).runWith(mock)));
