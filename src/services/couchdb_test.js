const test = require("tape");
const couchdb = require("./couchdb");

const config = {
  db: "http://localhost:5984",
  user: "admin",
  password: "password",
};

const couch = couchdb(config);

const doc1 = {
  db: "test",
  id: "1",
  doc: { hello: "world" },
};

const fork = (m) => (t) => {
  t.plan(1);
  return m.fork(
    () => t.ok(false),
    () => t.ok(true)
  );
};

test("createDatabase", fork(couch.createDatabase("test")));
test("createDocument", fork(couch.createDocument(doc1)));
test("retriveDocument", fork(couch.retrieveDocument({ db: "test", id: "1" })));
test(
  "updateDocument",
  fork(
    couch.updateDocument({
      db: "test",
      id: "1",
      doc: { goodbye: "moon" },
    })
  )
);
test("removeDocument", fork(couch.removeDocument({ db: "test", id: "1" })));
test("removeDatabase", fork(couch.removeDatabase("test")));
