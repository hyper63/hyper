import { z } from "./deps.js";
import { assert } from "./dev_deps.js";

import RedisCacheAdapter from "./mod.js";

const schema = z.object({
  id: z.string().optional(),
  port: z.string().optional(),
  load: z.function()
    .args(z.any().optional())
    .returns(z.any()),
  link: z.function()
    .args(z.any())
    .returns(
      z.function()
        .args(z.any())
        .returns(z.any()),
    ),
});

Deno.test("validate schema", () => {
  assert(schema.safeParse(RedisCacheAdapter()).success);
});
