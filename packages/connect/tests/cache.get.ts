import { test } from "uvu";
import * as assert from "uvu/assert";
import { get } from "../src/services/cache";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("cache.get", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "cache");
    assert.is(h.method, "GET");
    return Promise.resolve(
      new Request("http://localhost/cache/1", { method: "GET" }),
    );
  };

  await get("game-1")(mockRequest);
});

test.run();
