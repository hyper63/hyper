import { test } from "uvu";
import * as assert from "uvu/assert";
import { add } from "../src/services/search";
import { identity } from "ramda";

test("search.add", () => {
  const request = add("game-1", { foo: "bar" })(identity);
  assert.is(request.service, "search");
  assert.is(request.method, "POST");
  assert.is(request.body.key, "game-1");
});

test.run();
