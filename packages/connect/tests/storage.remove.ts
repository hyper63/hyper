import { test } from "uvu";
import * as assert from "uvu/assert";
import { remove } from "../src/services/storage";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("storage.remove", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "storage");
    assert.is(h.method, "DELETE");
    //assert.is(path(["body", "key"], h), "game-1");
    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket/${h.resource}`),
    );
  };
  const req = await remove("avatar.png")(mockRequest);
  assert.is(req.url, "http://localhost/storage/bucket/avatar.png");
});

test.run();
