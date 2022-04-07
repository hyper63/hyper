import { assertEquals } from "../dev_deps.ts";
import { toDataQuery } from "../utils/hyper-query.ts";

const { test } = Deno;

test("toDataQuery - maps selector", () => {
  assertEquals(toDataQuery({ foo: "bar" }), { selector: { foo: "bar" } });
});

test("toDataQuery - maps useIndex and options", () => {
  assertEquals(
    toDataQuery({ foo: "bar" }, { fields: ["foo"], useIndex: "idx-foo" }),
    { selector: { foo: "bar" }, fields: ["foo"], use_index: "idx-foo" },
  );
});
