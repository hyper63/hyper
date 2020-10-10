const test = require("tape");
const db = require("./db");
const { Resolved } = require("crocks/Async");

const mockDb = {
  createDatabase(name) {
    return Resolved({ ok: true });
  },
  removeDatabase(name) {
    return Resolved({ ok: true });
  },
};

test("create database", (t) => {
  t.plan(1);
  db.create("foo")
    .runWith(mockDb)
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    );
});

test("remove database", (t) => {
  t.plan(1);
  db.remove("foo")
    .runWith(mockDb)
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    );
});
