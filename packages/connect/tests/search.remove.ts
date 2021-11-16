import { test } from "uvu";
import * as assert from "uvu/assert";
import { remove } from "../src/services/search";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("search.remove", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "search");
    assert.is(h.method, "DELETE");
    assert.is(h.resource, "game-1");
    return Promise.resolve(new Request("http://localhost"));
  };
  await remove("game-1")(mockRequest);
});

test.run();
