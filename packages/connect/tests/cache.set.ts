import { test } from "uvu";
import * as assert from "uvu/assert";
import { set } from "../src/services/cache";
import { HyperRequest } from "../src/types"
import { Request } from "node-fetch";
import { path } from 'ramda'

test("cache.set", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, 'cache')
    assert.is(h.method, 'PUT')
    assert.is(h.resource, 'game-1')
    assert.is(h.params?.ttl, '1m')
    assert.is(path(['body', 'type'], h), 'game')
    
    return Promise.resolve(new Request('http://localhost'))
  }

  await set("game-1", { id: "game-1", type: "game" }, "1m")(mockRequest);
  
});

test.run();
