import { test } from "uvu";
import * as assert from "uvu/assert";
import { HyperRequest } from "../src/types";
import { destroy } from "../src/services/search";
import { Request } from "node-fetch";

test("search.destroy", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "search");
    assert.is(h.method, "DELETE");
    return Promise.resolve(
      new Request("http://localhost", { method: "DELETE" }),
    );
  };

  await destroy(true)(mockRequest);
});

test.run();
