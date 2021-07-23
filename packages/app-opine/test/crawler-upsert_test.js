import { crocks } from "../deps.js";
import { assertEquals, superdeno } from "../dev_deps.js";

import build from "../mod.js";

Deno.env.set("DENO_ENV", "test");

const app = build({
  crawler: {
    upsert: () => crocks.Async.Resolved({ ok: true }),
  },
  middleware: [],
});

Deno.test("PUT /crawler/test/spider", async () => {
  const res = await superdeno(app)
    .put("/crawler/test/spider")
    .set("Content-Type", "application/json")
    .send({
      source: "https://example.com",
      depth: 2,
      script: "",
      target: {
        url: "https://jsonplaceholder.typicode.com/posts",
        sub: "1234",
        aud: "https://example.com",
        secret: "secret",
      },
      notify: "https://example.com",
    });

  assertEquals(res.body.ok, true);
});
