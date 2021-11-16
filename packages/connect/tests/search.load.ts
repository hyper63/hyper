import { test } from "uvu";
import * as assert from "uvu/assert";
import { load } from "../src/services/search";
import { identity } from "ramda";

test("search.load", () => {
  const request = load([{ foo: 'bar' }])(identity);
  assert.is(request.service, "search");
  assert.is(request.method, "POST");
  assert.is(request.action, "_bulk");
  assert.is(request.body[0].foo, 'bar');
});

test.run();
