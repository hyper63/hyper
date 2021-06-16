// deno-lint-ignore-file no-unused-vars
import { assertEquals } from "../../dev_deps.js";
import * as doc from "./doc.js";
const test = Deno.test;

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

const fork = (m) =>
  () => {
    return m.fork(
      () => assertEquals(false, true),
      () => assertEquals(true, true),
    );
  };

const events = {
  dispatch: () => null,
};

test(
  "create document",
  fork(doc.create("foo", { hello: "world" }).runWith({ svc: mock, events })),
);
test("get document", fork(doc.get("foo", "1").runWith({ svc: mock, events })));
test(
  "update document",
  fork(
    doc.update("foo", "1", { id: "1", goodbye: "moon" }).runWith({
      svc: mock,
      events,
    }),
  ),
);
test(
  "remove document",
  fork(doc.remove("foo", "1").runWith({ svc: mock, events })),
);
