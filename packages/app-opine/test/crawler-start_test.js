import { crocks } from "../deps.js";
import { assertEquals, superdeno } from "../dev_deps.js";

import build from "../mod.js";

Deno.env.set("DENO_ENV", "test");

const app = build({
  crawler: {
    start: () => crocks.Async.Resolved({ ok: true }),
  },
  middleware: [],
});

Deno.test("POST /crawler/test/spider/_start", async () => {
  const res = await superdeno(app)
    .post("/crawler/test/spider/_start")
    .send();

  assertEquals(res.body.ok, true);
});
