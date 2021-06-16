// deno-lint-ignore-file no-unused-vars
import { assertEquals } from "../../dev_deps.js";
import * as db from "./db.js";
const test = Deno.test;

const mockDb = {
  createDatabase(name) {
    return Promise.resolve({ ok: true });
  },
  removeDatabase(name) {
    return Promise.resolve({ ok: true });
  },
  bulkDocuments({ db, docs }) {
    if (docs.length === 2) {
      return Promise.resolve({
        ok: true,
        results: [{ ok: true, id: "1" }, { ok: true, id: "2" }],
      });
    } else {
      return Promise.reject({ ok: false });
    }
  },
};

const fork = (m) =>
  () => {
    return m.fork(
      () => assertEquals(false, true),
      () => assertEquals(true, true),
    );
  };
const handleFail = (m) =>
  () => {
    return m.fork(
      () => assertEquals(true, true),
      () => assertEquals(false, true),
    );
  };

const events = {
  dispatch: () => null,
};

test(
  "create database",
  fork(db.create("foo").runWith({ svc: mockDb, events })),
);
test(
  "remove database",
  fork(db.remove("foo").runWith({ svc: mockDb, events })),
);
test(
  "bulk documents",
  fork(
    db.bulk("foo", [{ id: "1" }, { id: "2" }]).runWith({ svc: mockDb, events }),
  ),
);
test(
  "bulk docs failure",
  handleFail(db.bulk("foo", []).runWith({ svc: mockDb, events })),
);
// test("query database");
// test("index database");
