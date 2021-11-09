import { test } from "uvu";
import * as assert from "uvu/assert";
import { query } from "../src/services/cache";
import { identity } from "ramda";

test("cache.query", () => {
  const request = query("game*")(identity);
  assert.is(request.service, "cache");
  assert.is(request.method, "POST");
  assert.is(request.action, "_query");
  assert.is(request.params.pattern, "game*")
});

test.run();
