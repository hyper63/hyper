// deno-lint-ignore-file no-unused-vars
import { assert, assertEquals } from "../../dev_deps.js";
import * as doc from "./doc.js";
const test = Deno.test;

const mock = {
  createDocument({ db, id, doc }) {
    return Promise.resolve({ ok: true, id: id, doc });
  },
  retrieveDocument({ db, id }) {
    return Promise.resolve({ _id: id });
  },
  updateDocument({ db, id, doc }) {
    return Promise.resolve({ ok: true, id: id });
  },
  removeDocument({ db, id }) {
    return Promise.resolve({ ok: true });
  },
};

const fork = (m) =>
  () => {
    return m.bimap(
      () => assertEquals(false, true),
      () => assertEquals(true, true),
    ).toPromise();
  };

const events = {
  dispatch: () => null,
};

test(
  "create document",
  fork(doc.create("foo", { hello: "world" }).runWith({ svc: mock, events })),
);

test(
  "create document - use _id",
  fork(
    doc.create("foo", { hello: "world", _id: "foo", id: "should_be_ignored" })
      .map((res) => {
        assertEquals(res.id, "foo");
        return res;
      })
      .runWith({ svc: mock, events }),
  ),
);

test(
  "create document - use id",
  fork(
    doc.create("foo", { hello: "world", id: "no _id" })
      .map((res) => {
        assertEquals(res.id, "no _id");
        return res;
      })
      .runWith({ svc: mock, events }),
  ),
);

test(
  "create document - generate id with cuid()",
  fork(
    doc.create("foo", { hello: "world" })
      .map((res) => {
        assert(res.id);
        return res;
      })
      .runWith({ svc: mock, events }),
  ),
);

test(
  "create document - set ids on doc",
  fork(
    doc.create("foo", { hello: "world", _id: "foo" })
      .map((res) => {
        assert(res.doc._id);
        assert(res.doc.id);
        assertEquals(res.doc.id, res.doc._id);
        return res;
      })
      .runWith({ svc: mock, events }),
  ),
);

test(
  "create document - no document",
  fork(
    doc.create("foo")
      .map((res) => {
        assertEquals(Object.keys(res.doc).length, 0);
        return res;
      })
      .runWith({ svc: mock, events }),
  ),
);

test("get document", fork(doc.get("foo", "1").runWith({ svc: mock, events })));
test(
  "update document",
  fork(
    doc.update("foo", "1", { _id: "1", goodbye: "moon" }).runWith({
      svc: mock,
      events,
    }),
  ),
);
test(
  "remove document",
  fork(doc.remove("foo", "1").runWith({ svc: mock, events })),
);

test(
  "apricot - both id and _id",
  fork(
    doc.get("foo", "1")
      .map((res) => {
        assert(res.id);
        assert(res._id);
        return res;
      })
      .runWith({ svc: mock, events }),
  ),
);
