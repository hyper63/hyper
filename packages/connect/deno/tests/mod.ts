// deno-lint-ignore-file ban-ts-comment
import { assertEquals } from "../dev_deps.ts";
import { connect } from "../mod.ts";

const test = Deno.test;

test("mod", async (t) => {
  await t.step("not found", async () => {
    globalThis.fetch = () =>
      Promise.resolve(
        new Response(JSON.stringify({ ok: false }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      );

    const hyper = connect("http://localhost:6363/test");
    const result = await hyper.data.get("test-1");
    assertEquals(result.ok, false);
    // @ts-ignore
    assertEquals(result.status, 404);
  });

  await t.step("found", async () => {
    globalThis.fetch = () =>
      Promise.resolve(
        new Response(JSON.stringify({ ok: true, doc: { _id: "test-1" } }), {
          status: 404,
          headers: { "content-type": "application/json" },
        }),
      );

    const hyper = connect("http://localhost:6363/test");
    const result = await hyper.data.get("test-1");
    assertEquals(result.ok, true);
    // @ts-ignore
    assertEquals(result.doc, { _id: "test-1" });
  });
});
