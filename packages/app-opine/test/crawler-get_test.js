import { crocks } from "../deps.js";
import { assertEquals, superdeno } from "../dev_deps.js";

import build from "../mod.js";

Deno.env.set("DENO_ENV", "test");

const app = build({
  crawler: {
    get: () =>
      crocks.Async.Resolved({
        id: "test-spider",
        app: "test",
        name: "spider",
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
      }),
  },
  middleware: [],
});

Deno.test("GET /crawler/test/spider", async () => {
  const res = await superdeno(app)
    .get("/crawler/test/spider")
    .send();

  assertEquals(res.body.id, "test-spider");
});
