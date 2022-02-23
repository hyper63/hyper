import { assert, assertEquals } from "../../dev_deps.js";
import { z } from "../../deps.js";

import { HyperErrFrom, mapErr, mapStatus } from "./err.js";

const { test } = Deno;

test("mapErr - should map the error", () => {
  let res = mapErr("foobar");
  assertEquals(res, "foobar");

  res = mapErr(new Error("foobar"));
  assertEquals(res, "foobar");

  res = mapErr({ message: "foobar" });
  assertEquals(res, "foobar");

  res = mapErr({ foo: "bar" });
  assertEquals(res, JSON.stringify({ foo: "bar" }));

  // recursion
  res = mapErr({ error: "bar" });
  assertEquals(res, "bar");

  res = mapErr({ errors: "bar" });
  assertEquals(res, "bar");

  res = mapErr({ error: { error: { error: "bar" } } });
  assertEquals(res, "bar");

  res = mapErr([{ error: "foo" }, { message: "bar" }]);
  assertEquals(res, "foo, bar");

  // generic
  res = mapErr(undefined);
  assertEquals(res, "An error occurred");

  // field preference
  res = mapErr({ msg: "foo", error: { msg: "bar" } });
  assertEquals(res, "foo");

  res = mapErr({ msg: { error: "foo" }, error: { msg: "bar" } });
  assertEquals(res, "foo");
});

test("mapStatus - should parse status", () => {
  assertEquals(mapStatus(200), 200);
  assertEquals(mapStatus({ status: 200 }), 200);
  assertEquals(mapStatus({ statusCode: 200 }), 200);

  // parseable
  assertEquals(mapStatus("200"), 200);

  // not parseable
  assertEquals(mapStatus("foo"), undefined);
  assertEquals(mapStatus(undefined), undefined);
  assertEquals(mapStatus({}), undefined);

  // field preference
  assertEquals(mapStatus({ status: 200, statusCode: 400 }), 200);
  assertEquals(
    mapStatus({ status: { statusCode: 200 }, statusCode: 400 }),
    200,
  );
});

test("HyperErrFrom - should accept nil, string, object, array, function, basically should never throw", () => {
  assert(HyperErrFrom());
  assert(HyperErrFrom({}));
  assert(HyperErrFrom("foo"));
  assert(HyperErrFrom({ msg: "foo" }));
  assert(HyperErrFrom({ foo: "bar" }));
  assert(HyperErrFrom([]));
  assert(HyperErrFrom(function () {}));
});

test("HyperErrFrom - should map ZodError to HyperErr", async () => {
  const schema = z.function().args(z.string()).returns(
    z.promise(z.object({ ok: z.boolean() })),
  );

  const fn = schema.validate(function wrongReturn() {
    return Promise.resolve({ not: "ok" });
  });

  const err = await fn("string").catch(HyperErrFrom);

  assertEquals(err.ok, false);
  assert(!err.status);
  assertEquals(err.msg, "invalid_return_type: ok(invalid_type) - Required");

  const errWrongArgs = await fn(123).catch(HyperErrFrom);

  assertEquals(errWrongArgs.ok, false);
  assert(!errWrongArgs.status);
  assertEquals(
    errWrongArgs.msg,
    "invalid_arguments: 0(invalid_type) - Expected string, received number",
  );
});

test("HyperErrFrom - should set fields", () => {
  const base = HyperErrFrom();
  const withStatus = HyperErrFrom({ status: 404 });
  const fromStr = HyperErrFrom("foo");
  const fromObj = HyperErrFrom({ msg: "foo" });
  const strip = HyperErrFrom({ msg: "foo", omit: "me" });
  const withInvalidStatus = HyperErrFrom({ status: "not_parseable" });

  assertEquals(base.ok, false); // all should have ok false

  assertEquals(withStatus.status, 404);
  assert(withStatus.originalErr); // all should have orignalErr

  assert(!Object.keys(fromStr).includes("status"));
  assert(!withInvalidStatus.status);

  assertEquals(fromStr.msg, "foo");
  assertEquals(fromObj.msg, "foo");
  assert(!strip.omit);
});
