import { test } from "uvu";
import * as assert from "uvu/assert";
import { add } from "../src/services/search";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";
import { path } from "ramda";

test("search.add", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "search");
    assert.is(h.method, "POST");
    assert.is(path(["body", "key"], h), "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await add("game-1", { foo: "bar" })(mockRequest);
});

test.run();
