import { test } from "uvu";
import * as assert from "uvu/assert";
import { query } from "../src/services/search";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("search.query", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "search");
    assert.is(h.method, "POST");
    assert.is(h.action, "_query");
    return Promise.resolve(new Request("http://localhost"));
  };
  await query("game")(mockRequest);
});

test.run();
