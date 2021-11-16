import { test } from "uvu";
import * as assert from "uvu/assert";
import { update } from "../src/services/data";
import { path } from "ramda";
import { HyperRequest } from "../src/types";
import { Request } from "node-fetch";

test("data.update", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "data");
    assert.is(h.method, "PUT");
    assert.is(h.resource, "game-1");
    assert.is(path(["body", "foo"], h), "bar");

    return Promise.resolve(new Request("http://localhost"));
  };

  await update("game-1", { foo: "bar" })(mockRequest);
});

test.run();
