import { crocks } from "../deps.js";
import { assertEquals, superdeno } from "../dev_deps.js";

import build from "../mod.js";

Deno.env.set("DENO_ENV", "test");

const app = build({
  crawler: {
    remove: () => crocks.Async.Resolved({ ok: true }),
  },
  middleware: [],
});

Deno.test("DELETE /crawler/test/spider", async () => {
  const res = await superdeno(app)
    .delete("/crawler/test/spider")
    .send();

  assertEquals(res.body.ok, true);
});
