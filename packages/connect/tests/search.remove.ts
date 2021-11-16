import { test } from "uvu";
import * as assert from "uvu/assert";
import { remove } from "../src/services/search";
import { identity } from "ramda";

test("search.remove", () => {
  const request = remove("game-1")(identity);
  assert.is(request.service, "search");
  assert.is(request.method, "DELETE");
  assert.is(request.resource, "game-1");
});

test.run();
