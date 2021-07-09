// deno-lint-ignore-file no-unused-vars

import { crawler as crawlerPort } from "./mod.js";
import { assertEquals } from "./dev_deps.js";

const test = Deno.test;

test("first test", () => {
  assertEquals(true, true);
});
