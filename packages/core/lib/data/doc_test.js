// deno-lint-ignore-file no-unused-vars
import { assert, assertEquals } from "../../dev_deps.js";
import * as doc from "./doc.js";
const test = Deno.test;

const mock = {
  createDocument({ db, id, doc }) {
    return Promise.resolve({ ok: true, id, doc });
  },
  retrieveDocument({ db, id }) {
    if (id === "err") {
      return Promise.resolve({ ok: false });
    }

    return Promise.resolve({ _id: id });
  },
  updateDocument({ db, id, doc }) {
    if (id === "err") {
      return Promise.resolve({ ok: false });
    }
    return Promise.resolve({ ok: true, id: id });
  },
  removeDocument({ db, id }) {
    return Promise.resolve({ ok: true });
  },
};

const fork = (m) => () => {
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
  "create document - do NOT use id and generate id",
  fork(
    doc.create("foo", { hello: "world", id: "should_be_ignored" })
      .map((res) => {
        assert(res.id);
        assert(res.id !== "should_be_ignored");
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
  "create document - no document",
  fork(
    doc.create("foo")
      .map((res) => {
        assert(res.id);
        assertEquals(Object.keys(res.doc).length, 0);
        return res;
      })
      .runWith({ svc: mock, events }),
  ),
);

test("get document", fork(doc.get("foo", "1").runWith({ svc: mock, events })));

test(
  "get document - err",
  fork(
    doc.get("foo", "err")
      .map((res) => {
        assert(!res.ok);
      }).runWith({ svc: mock, events }),
  ),
);

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
  "update document - err",
  fork(
    doc.update("foo", "err", { _id: "1", goodbye: "moon" })
      .map((res) => {
        assert(!res.ok);
      }).runWith({
        svc: mock,
        events,
      }),
  ),
);
test(
  "remove document",
  fork(doc.remove("foo", "1").runWith({ svc: mock, events })),
);
