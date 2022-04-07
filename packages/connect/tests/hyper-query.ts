import { test } from "uvu";
import * as assert from "uvu/assert";
import { toDataQuery } from "../src/utils/hyper-query";

test("toDataQuery - maps selector", () => {
  assert.equal(toDataQuery({ foo: "bar" }), { selector: { foo: "bar" } });
});

test("toDataQuery - maps useIndex and options", () => {
  assert.equal(
    toDataQuery({ foo: "bar" }, { fields: ["foo"], useIndex: "idx-foo" }),
    { selector: { foo: "bar" }, fields: ["foo"], use_index: "idx-foo" },
  );
});

test.run();
