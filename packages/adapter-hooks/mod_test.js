import { assert } from "./dev_deps.js";

import hooksAdapter from "./mod.js";

Deno.test("call hooks", () => {
  const adapter = hooksAdapter().link()();

  assert(adapter.call);
});
