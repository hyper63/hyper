import { test } from "uvu";
import * as assert from "uvu/assert";
import { get } from "../src/services/search";
import { identity } from "ramda";

test("search.get", () => {
  const request = get("game-1")(identity);
  assert.is(request.service, "search");
  assert.is(request.method, "GET");
  assert.is(request.resource, "game-1");
});

test.run();
