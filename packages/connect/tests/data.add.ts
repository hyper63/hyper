import { test } from "uvu";
import * as assert from "uvu/assert";
import { add } from "../src/services/data";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";
import { path } from "ramda";

test("data.add", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "data");
    assert.is(h.method, "POST");
    assert.is(path(["body", "foo"], h), "bar");
    return Promise.resolve(new Request("http://localhost"));
  };
  await add({ foo: "bar" })(mockRequest);
});

test.run();
