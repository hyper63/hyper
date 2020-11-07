import { default as test } from 'tape'
import * as buckets from './buckets'
import { Resolved } from 'crocks/Async'

const mock = {
  makeBucket(name) {
    return Resolved({ ok: true });
  },
  removeBucket(name) {
    return Resolved({ ok: true });
  },
  listBuckets() {
    return Resolved({ ok: true, buckets: ["one", "two", "three"] });
  },
};

const fork = (m) => (t) => {
  t.plan(1);
  m.fork(
    () => t.ok(false),
    () => t.ok(true)
  );
};

test("make bucket", fork(buckets.make("beep").runWith(mock)));
test("remove bucket", fork(buckets.remove("beep").runWith(mock)));
test("list buckets", fork(buckets.list().runWith(mock)));
