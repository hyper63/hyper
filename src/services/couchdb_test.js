const test = require("tape");
const couchdb = require("./couchdb");

test("removeDatabase", (t) => {
  t.plan(1);
  couchdb({
    db: "http://localhost:5984",
    user: "admin",
    password: "password",
  })
    .removeDatabase("test")
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    );
});

test("createDatabase", (t) => {
  t.plan(1);
  couchdb({
    db: "http://localhost:5984",
    user: "admin",
    password: "password",
  })
    .createDatabase("test")
    .fork(
      (e) => {
        t.ok(false);
      },
      (r) => {
        t.ok(true);
      }
    );
});
