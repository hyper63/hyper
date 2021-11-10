import { test } from "uvu";
import * as assert from "uvu/assert";
import { remove } from "../src/services/data";
import { identity } from "ramda";

test("data.remove", () => {
  const request = remove("game-1")(identity);
  assert.is(request.service, "data");
  assert.is(request.method, "DELETE");
  assert.is(request.resource, "game-1");
});

test.run();
