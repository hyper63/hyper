const test = require("tape");
const minio = require("./minio");
const fs = require("fs");
const path = require("path");

const s = fs.createReadStream(path.resolve("./hubble-banner.png"));
const svc = minio({
  endPoint: "localhost",
  port: 9000,
  accessKey: "minio",
  secretKey: "minio123",
  useSSL: false,
});

const fork = (m) => (t) => {
  t.plan(1);
  m.fork(
    (r) => {
      console.log(r);
      t.ok(false);
    },
    (r) => {
      console.log(r);
      t.ok(true);
    }
  );
};

test("make bucket successfully", fork(svc.makeBucket("test")));
test("list buckets", fork(svc.listBuckets()));
test("put object", fork(svc.putObject("test", "hubble-banner.png", s)));
test("list objects", fork(svc.listObjects("test")));
test("get object", (t) => {
  let size = 0;
  t.plan(1);
  svc.getObject("test", "hubble-banner.png").fork(
    () => t.ok(false),
    (s) => {
      s.on("data", (chunk) => {
        size += chunk.length;
      });
      s.on("end", () => {
        t.equal(size, 34960);
      });
      s.on("error", (err) => t.ok(false));
    }
  );
});
test(
  "remove object successfully",
  fork(svc.removeObject("test", "hubble-banner.png"))
);
test("remove bucket successfully", fork(svc.removeBucket("test")));
