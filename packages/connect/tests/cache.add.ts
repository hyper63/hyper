import { test } from "uvu";
import * as assert from "uvu/assert";
import { add } from "../src/services/cache";
import { Request } from "node-fetch";
import { HyperRequest } from "../src/types"


test("cache.add", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "cache");
    assert.is(h.method, "POST");
    return Promise.resolve(new Request('http://localhost/cache/app', {method: 'POST', body: JSON.stringify(h.body)}))
  }
  const result = await add("game-1", { id: "game-1", type: "game" })(mockRequest)
  const body = await result.json()
  assert.is(body.key, "game-1");
});

test.run();
