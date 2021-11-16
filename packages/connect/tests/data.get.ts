import { test } from "uvu";
import * as assert from "uvu/assert";
import { get } from "../src/services/data";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("data.get", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "data");
    assert.is(h.method, "GET");
    assert.is(h.resource, "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await get("game-1")(mockRequest);
});

test.run();
