import { assert, superdeno } from "../dev_deps.js";
import { crocks } from "../deps.js";

import build from "../mod.js";

Deno.env.set("DENO_ENV", "test");

const app = build({
  data: {
    listDocuments: (_info, _options) => {
      return crocks.Async.Resolved({ ok: true, docs: [] });
    },
  },
  middleware: [],
});

Deno.test("GET /data/movies?limit=2", async () => {
  const res = await superdeno(app)
    .get("/data/movies?limit=2");

  assert(res.body.ok);

  const res2 = await superdeno(app)
    .get("/data/movies");

  assert(res2.body.ok);
});
