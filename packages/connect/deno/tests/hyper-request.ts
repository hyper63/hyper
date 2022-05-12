import { assert, assertEquals } from "../dev_deps.ts";

import { generateToken } from "../deps.deno.ts";

Deno.test("generateToken", async () => {
  try {
    const res = await generateToken("SUB", "SECRET");
    assert(true);
    assertEquals(typeof res, "string");
    // deno-lint-ignore no-explicit-any
  } catch (error: any) {
    assert(false, error.message);
  }
});
