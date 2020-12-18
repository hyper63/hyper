const test = require('tape')
const db = require('./db.js')

const mockDb = {
  createDatabase(name) {
    return Promise.resolve({ ok: true });
  },
  removeDatabase(name) {
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

test("create database", fork(db.create("foo").runWith({ svc: mockDb, events })));
test("remove database", fork(db.remove("foo").runWith({ svc: mockDb, events })));
//test("query database");
//test("index database");
