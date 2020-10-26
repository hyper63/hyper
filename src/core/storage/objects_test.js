const test = require("tape");
const objects = require("./objects");
const { Resolved } = require("crocks/Async");
const fs = require("fs");
const path = require("path");

const mock = {
  putObject({ bucket, object, stream }) {
    return Resolved({ ok: true });
  },
  getObject({ bucket, object }) {
    return Resolved({ ok: true });
  },
  removeObject({ bucket, object }) {
    return Resolved({ ok: true });
  },
  listObjects({ bucket, prefix }) {
    return Resolved({ ok: true, objects: ["one.txt", "two.txt", "three.txt"] });
  },
};

const fork = (m) => (t) => {
  t.plan(1);
  m.fork(
    () => t.ok(false),
    () => t.ok(true)
  );
};

test(
  "put object",
  fork(
    objects
      .put(
        "test",
        "test.png",
        fs.createReadStream(path.resolve("./hyper63-logo.png"))
      )
      .runWith(mock)
  )
);
test("remove bucket", fork(objects.remove("beep").runWith(mock)));
test("list buckets", fork(objects.list().runWith(mock)));