import { test } from "uvu";
import * as assert from "uvu/assert";
import { HyperRequest } from "../src/types";
import { create } from "../src/services/search";
import { Request } from "node-fetch";

test("search.create", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "search");
    assert.is(h.method, "PUT");
    return Promise.resolve(
      new Request("http://localhost", {
        method: "PUT",
        body: JSON.stringify(h.body),
      }),
    );
  };

  const result = await create(["title"])(mockRequest);
  const body = await result.json();
  assert.is(body.fields[0], "title");
});

test.run();
