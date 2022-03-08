// deno-lint-ignore-file no-unused-vars
import { assert, assertEquals } from "../../dev_deps.js";
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
  listDocuments({ db, limit, start, end, keys, descending }) {
    if (db === "err") {
      return Promise.resolve({ ok: false, status: 400 });
    }
    return Promise.resolve({ ok: true, docs: [{ _id: "1" }, { _id: "2" }] });
  },
  queryDocuments({ db, query }) {
    if (query.selector === "err") {
      return Promise.resolve({ ok: false, status: 400 });
    }
    return Promise.resolve({ ok: true, docs: [{ _id: "1" }, { _id: "2" }] });
  },
};

const fork = (m) =>
  () => {
    return m.bimap(
      () => assertEquals(false, true),
      () => assertEquals(true, true),
    ).toPromise();
  };
const handleFail = (m) =>
  () => {
    return m.bimap(
      () => assertEquals(false, true), // catastrophic error shouldn't happen
      (err) => {
        assertEquals(err.ok, false);
        assert(err.originalErr);
      },
    ).toPromise().catch((e) => e);
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
    db.bulk("foo", [{ _id: "1" }, { _id: "2" }])
      .map((res) => {
        res.results.forEach((r) => {
          assert(r.id);
        });
        return res;
      })
      .runWith({ svc: mockDb, events }),
  ),
);
test(
  "bulk docs - resolve failure",
  handleFail(db.bulk("foo", []).runWith({ svc: mockDb, events })),
);

test(
  "list docs",
  fork(
    db.list("foo", { limit: "2" })
      .map((res) => {
        res.docs.forEach((r) => {
          assert(r.id);
          assert(r._id);
        });
        return res;
      })
      .runWith({ svc: mockDb, events }),
  ),
);

test(
  "list docs",
  fork(
    db.list("foo", { descending: true }).runWith({ svc: mockDb, events }),
  ),
);

test(
  "list docs - err",
  fork(
    db.list("err", { descending: true })
      .map((res) => {
        assert(!res.ok);
        assert(!res.docs);
      }).runWith({ svc: mockDb, events }),
  ),
);

test(
  "query docs",
  fork(
    db.query("foo", { selector: { id: "foo" } })
      .map((res) => {
        res.docs.forEach((r) => {
          assert(r.id);
          assert(r._id);
        });
        return res;
      })
      .runWith({ svc: mockDb, events }),
  ),
);

test(
  "query docs - err",
  fork(
    db.query("foo", { selector: "err" })
      .map((res) => {
        assert(!res.ok);
        assert(!res.docs);
      })
      .runWith({ svc: mockDb, events }),
  ),
);

// test("index database");
