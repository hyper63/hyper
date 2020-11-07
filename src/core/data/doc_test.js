import { default as test } from 'tape'
import * as db from './db'
import { Resolved } from 'crocks/Async'

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
  fork(doc.create("foo", { hello: "world" }).runWith(mock))
);
test("get document", fork(doc.get("foo", "1").runWith(mock)));
test(
  "update document",
  fork(doc.update("foo", "1", { id: "1", goodbye: "moon" }).runWith(mock))
);
test("remove document", fork(doc.remove("foo", "1").runWith(mock)));
