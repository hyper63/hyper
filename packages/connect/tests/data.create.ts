import { test } from "uvu";
import * as assert from "uvu/assert";
import { HyperRequest } from "../src/types"
import { create } from "../src/services/data";
import { Request } from "node-fetch";

test("data.create", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "data");
    assert.is(h.method, "PUT");
    return Promise.resolve(new Request('http://localhost', { method: 'PUT'}))
  }

  await create()(mockRequest)

  
});

test.run();
