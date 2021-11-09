import { test } from "uvu";
import * as assert from "uvu/assert";
import { remove } from "../src/services/cache";
import { identity } from "ramda";

test("cache.remove", () => {
  const request = remove("game-1")(identity);
  assert.is(request.service, "cache");
  assert.is(request.method, "DELETE");
  assert.is(request.resource, "game-1");
});

test.run();
