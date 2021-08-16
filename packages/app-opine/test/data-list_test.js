import { assert, superdeno } from "../dev_deps.js";
import { crocks } from "../deps.js";

import build from "../mod.js";

Deno.env.set("DENO_ENV", "test");

const app = build({
  data: {
    listDocuments: (info, options) => {
      console.log("info: ", info);
      console.log("options: ", options);
      return crocks.Async.Resolved({ ok: true, docs: [] });
    },
  },
  middleware: [],
});

Deno.test("GET /data/movies?limit=2", async () => {
  const res = await superdeno(app)
    .get("/data/movies?limit=2");

  console.log(res.body);
  assert(res.body.ok);

  const res2 = await superdeno(app)
    .get("/data/movies");

  console.log(res2.body);
  assert(res2.body.ok);
});
