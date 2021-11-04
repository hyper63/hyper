import connect from "./mod.ts";

import { dataCachePlugin } from "./engine.ts";

// deno-lint-ignore no-explicit-any
const hyper = connect("http://localhost:6363", [dataCachePlugin]) as any;

// Should simply cache
console.log("Add foo-2 to cache");
console.log(
  await hyper("foo").cache.add("foo-2", {
    id: "foo-2",
    docType: "foo",
  }, "2m"),
);

// Should check cache, miss, add doc, the cache
console.log("Add foo-1 to data");
console.log(
  await hyper("foo").data.add({
    id: "foo-1",
    docType: "foo",
  }),
);

// should check cache, HIT, and bailout
console.log("Get foo-1 from data");
console.log(
  await hyper("foo").data.get("foo-1"),
);

// Should check cache, HIT, and bailout
console.log("Get foo-2 from data");
console.log(
  await hyper("foo").data.get("foo-2"),
);
