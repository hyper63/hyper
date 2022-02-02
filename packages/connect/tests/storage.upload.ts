import { test } from "uvu";
import * as assert from "uvu/assert";
import { upload } from "../src/services/storage";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";
import stream from 'stream';
//import { path } from "ramda";

test("storage.upload", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "storage");
    assert.is(h.method, "POST");
    //assert.is(path(["body", "key"], h), "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await upload("game-1", new stream.Readable())(mockRequest);
});

test.run();
