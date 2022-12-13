import { opine } from "../deps.js";
import { assert, superdeno } from "../dev_deps.js";

import legacyGet from "../lib/legacyGet.js";

Deno.test("legacyGet", async (t) => {
  const app = opine();
  app.get("/foo/bar", legacyGet, (req, res) => {
    res.json({ isLegacyGetEnabled: req.isLegacyGetEnabled });
  });

  await t.step("should extract the legacyGet header flag", async () => {
    const on = await superdeno(app)
      .get("/foo/bar")
      .set("x-hyper-legacy-get", true);
    assert(on.body.isLegacyGetEnabled);

    const off = await superdeno(app)
      .get("/foo/bar")
      .set("x-hyper-legacy-get", false);
    assert(!off.body.isLegacyGetEnabled);
  });

  await t.step("should not set legacyGet header flag", async () => {
    const on = await superdeno(app)
      .get("/foo/bar");
    assert(on.body.isLegacyGetEnabled === undefined);
  });
});
