import { test } from "uvu";
import * as assert from "uvu/assert";
import { get } from "../src/services/search";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("search.get", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "search");
    assert.is(h.method, "GET");
    assert.is(h.resource, "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await get("game-1")(mockRequest);
});

test.run();
