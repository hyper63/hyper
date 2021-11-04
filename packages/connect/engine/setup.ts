import connect from "./mod.ts";

import { dataCachePlugin } from "./engine.ts";

// deno-lint-ignore no-explicit-any
const hyper = connect("http://localhost:6363", [dataCachePlugin]) as any;

console.log(
  await hyper("foo").data.destroy(true),
);

console.log(
  await hyper("foo").cache.destroy(true),
);

console.log(
  await hyper("foo").data.create(),
);

console.log(
  await hyper("foo").cache.create(),
);
