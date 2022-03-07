import { HyperErr, isHyperErr } from "./hyper-err.js";
import { assert, assertEquals, assertThrows } from "./dev_deps.js";

const { test } = Deno;

test("isHyperErr - should match hyper err shapes", () => {
  assert(isHyperErr({ ok: false }));
  assert(!isHyperErr({ ok: true }));
  assert(!isHyperErr({ ok: false, _id: "foo" }));
});

test("HyperErr - should set fields", () => {
  const base = HyperErr();
  const withBase = HyperErr({ ok: false });
  const withStatus = HyperErr({ status: 404 });
  const fromStr = HyperErr("foo");
  const fromObj = HyperErr({ msg: "foo" });
  const strip = HyperErr({ msg: "foo", omit: "me" });
  const asConstructor = new HyperErr();

  // all should have ok false
  [base, withBase, withStatus, fromStr, fromObj, strip, asConstructor].forEach(
    (e) => assertEquals(e.ok, false),
  );

  assert(asConstructor instanceof HyperErr);
  assert(!withBase.msg);

  assertEquals(withStatus.status, 404);

  assert(!Object.keys(fromStr).includes("status"));

  assertEquals(fromStr.msg, "foo");
  assertEquals(fromObj.msg, "foo");
  assert(!strip.omit);

  // invalid status
  assertThrows(
    () => HyperErr({ status: "not_a_number" }),
    Error,
    "status must be a number",
  );
  // invalid msg
  assertThrows(
    () => HyperErr(123),
    Error,
    "HyperErr args must be a string or an object with msg and/or status",
  );
  // invalid msg
  assertThrows(() => HyperErr({ msg: 123 }), Error, "msg must be a string");
});
