import { test } from "uvu";
import * as assert from "uvu/assert";
import { query } from "../src/services/cache";
import { HyperRequest } from "../src/types"
import { Request } from "node-fetch";

test("cache.query", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "cache");
    assert.is(h.method, "POST");
    assert.is(h.action, "_query");
    assert.is(h.params?.pattern, "game*")

    return Promise.resolve(new Request('http://localhost/cache/_query', { method: 'POST'}))
  }

  await query("game*")(mockRequest);

});

test.run();
