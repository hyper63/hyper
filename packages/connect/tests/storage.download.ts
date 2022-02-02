import { test } from "uvu";
import * as assert from "uvu/assert";
import { download } from "../src/services/storage";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("storage.upload", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "storage");
    assert.is(h.method, "GET");
    //assert.is(path(["body", "key"], h), "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await download("avatar.png")(mockRequest);
});

test.run();
