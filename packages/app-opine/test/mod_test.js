// TODO: Tyler. Probably better way to do this
import { assertEquals, superdeno } from "../dev_deps.js";

import build from "../mod.js";

Deno.env.set("DENO_ENV", "test");

const app = build({
  middleware: [],
});

Deno.test("GET /", async () => {
  const res = await superdeno(app)
    .get("/")
    .expect(200);

  assertEquals(res.body.name, "hyper");
});

Deno.test("GET /foobarbaz", async () => {
  await superdeno(app)
    .get("/foobarbaz")
    .expect(404);
});

/*
Deno.test("GET /graphql", async () => {
  await superdeno(app)
    .get("/graphql")
    .set("Accept", "text/html") // ask for the playground
    .expect(200);
});
*/
