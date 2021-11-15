import { test } from "uvu";
import * as assert from "uvu/assert";
import { load } from "../src/services/search";
import { HyperRequest } from "../src/types"
import { Request } from "node-fetch";
import { path } from 'ramda' 

test("search.load", async () => {
  const mockRequest = (h: HyperRequest) => {
    assert.is(h.service, "search");
    assert.is(h.method, "POST");
    assert.is(h.action, "_bulk");
    assert.is(path(['body', 0, 'foo'], h), 'bar');

    return Promise.resolve(new Request('http://localhost'))
  }
  await load([{ foo: 'bar' }])(mockRequest);
  
});

test.run();
