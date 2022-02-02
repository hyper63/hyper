import { test } from "uvu";
import * as assert from "uvu/assert";
import { enqueue } from "../src/services/queue";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("queue.enqueue", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "queue");
    assert.is(h.method, "POST");
    //assert.is(path(["body", "key"], h), "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await enqueue({type: 'job', action: 'roadhouse'})(mockRequest);
});

test.run();
