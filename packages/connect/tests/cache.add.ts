import { test } from "uvu";
import * as assert from "uvu/assert";
import { add } from "../src/services/cache";
import { identity } from "ramda";

test("cache.add", () => {
  const request = add("game-1", { id: "game-1", type: "game" })(identity);
  assert.is(request.service, "cache");
  assert.is(request.method, "POST");
  assert.is(request.body.key, "game-1");
});

test.run();
