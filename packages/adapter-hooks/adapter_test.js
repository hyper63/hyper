import { crocks } from "./deps.js";
import {
  assert,
  assertEquals,
  assertObjectMatch,
  resolves,
  spy,
} from "./dev_deps.js";

import createAdapter from "./adapter.js";

const { Async } = crocks;

const logDb = "http://127.0.0.1:9200/log/_doc";

const hooks = [{
  matcher: "*",
  target: logDb,
}, {
  matcher: "TEST:*",
  target: logDb,
}, {
  matcher: "*:METHOD",
  target: logDb,
}, {
  matcher: "FOO:BAR",
  target: logDb,
}];

const fetch = spy(() => Promise.resolve(({ json: resolves({ ok: true }) })));

const asyncFetch = Async.fromPromise(fetch);

Deno.test("using hooks log event", async () => {
  const adapter = createAdapter({ asyncFetch, hooks });

  const action = {
    type: "TEST:METHOD",
    payload: { date: new Date().toISOString() },
  };

  const result = await adapter.call(action);
  assert(result[0].ok);
  assertEquals(result.length, 3);
  assertObjectMatch(fetch.calls[0], {
    args: [
      logDb,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      },
    ],
  });
});
