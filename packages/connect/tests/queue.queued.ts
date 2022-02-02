import { test } from "uvu";
import * as assert from "uvu/assert";
import { queued } from "../src/services/queue";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("queue.queued", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "queue");
    assert.is(h.method, "GET");
    //assert.is(path(["body", "key"], h), "game-1");
    return Promise.resolve(new Request(`http://localhost/?${new URLSearchParams(h.params)}`));
  };
  const req = await queued()(mockRequest);
  assert.is(req.url, 'http://localhost/?status=READY')
});

test.run();
