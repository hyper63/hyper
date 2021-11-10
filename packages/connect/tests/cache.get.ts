import { test } from "uvu";
import * as assert from "uvu/assert";
import { get } from "../src/services/cache";
import { identity } from "ramda";

test("cache.get", () => {
  const request = get("game-1")(identity);
  assert.is(request.service, "cache");
  assert.is(request.method, "GET");
  assert.is(request.resource, "game-1");
});

test.run();
