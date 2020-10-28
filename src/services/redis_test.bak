const test = require("tape");
const redis = require("./redis");
// requires redis to be running on port 6379
test("create document", (t) => {
  t.plan(6);
  const svc = redis();
  svc
    .createDoc({
      store: "foo",
      key: "bar",
      value: { hello: "world" },
    })
    .map((v) => {
      t.ok(v.ok);
      return v;
    })
    .chain((result) => svc.getDoc({ store: "foo", key: "bar" }))
    .map((doc) => t.deepEqual(doc, { hello: "world" }))
    .chain(() =>
      svc.updateDoc({ store: "foo", key: "bar", value: { hello: "Mars" } })
    )
    .map((result) => t.ok(result.ok))
    .chain(() => svc.getDoc({ store: "foo", key: "bar" }))
    .map((doc) => t.deepEqual(doc, { hello: "Mars" }))
    .chain(() => svc.deleteDoc({ store: "foo", key: "bar" }))
    .map((result) => t.ok(result.ok))
    .fork(
      () => t.ok(false),
      () => {
        t.ok(true);
        svc.close();
      }
    );
});
