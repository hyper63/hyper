import { assertEquals } from "../dev_deps.ts";

globalThis.fetch = () =>
  Promise.resolve(
    new Response(JSON.stringify({ ok: false }), {
      status: 404,
      headers: { "content-type": "application/json" },
    }),
  );

import { connect } from "../mod.ts";

const test = Deno.test;

test("connect", async () => {
  const hyper = connect("http://localhost:6363/test");
  // deno-lint-ignore no-explicit-any
  const result: Record<string, any> = await hyper.data.get("test-1");

  assertEquals(result.ok, false);
  assertEquals(result.status, 404);
});
