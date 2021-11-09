import { test } from "uvu";
import * as assert from "uvu/assert";
import { add } from "../src/services/data";
import { identity } from "ramda";

test("data.add", () => {
  const request = add({ foo: "bar" })(identity);
  assert.is(request.service, "data");
  assert.is(request.method, "POST");
  assert.is(request.body.foo, "bar");
});

test.run();
