import { test } from "uvu";
import * as assert from "uvu/assert";
import { HyperRequest } from "../src/types"
import { destroy } from "../src/services/cache";
import { Request } from "node-fetch";

test("cache.destroy", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "cache");
    assert.is(h.method, "DELETE");
    return Promise.resolve(new Request('http://localhost', { method: 'DELETE'}))
  }

  await destroy(true)(mockRequest)

  
});

test.run();