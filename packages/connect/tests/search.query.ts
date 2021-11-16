import { test } from "uvu";
import * as assert from "uvu/assert";
import { query } from "../src/services/search";
import { identity } from "ramda";

test("search.query", () => {
  const request = query("game", { fields: ['foo'] })(identity);
  assert.is(request.service, "search");
  assert.is(request.method, "POST");
  assert.is(request.action, "_query");
  assert.is(request.body.fields[0], 'foo');
});

test.run();
