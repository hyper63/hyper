import { crocks } from "../deps.js";
import { assert, assertEquals } from "../dev_deps.js";

import { fork } from "../utils.js";

const { Async } = crocks;

let result;
const res = {
  setStatus: () => res,
  send: (r) => {
    result = r;
  },
};

const env = Deno.env.get("DENO_ENV");
const cleanup = () =>
  env ? Deno.env.set("DENO_ENV", env) : Deno.env.delete("DENO_ENV");

Deno.test("should sanitize errors on both branches", async () => {
  Deno.env.set("DENO_ENV", "production");

  // resolved success
  await fork(res, 200, Async.Resolved({ ok: true }));
  assert(result.ok);

  // resolved error
  await fork(res, 200, Async.Resolved({ ok: false, originalErr: "foobar" }));
  assertEquals(result.ok, false);
  assert(!result.originalErr);

  // rejected error (fatal)
  await fork(res, 200, Async.Rejected({ ok: false, originalErr: "foobar" }));
  assertEquals(result, "Internal Server Error");

  cleanup();
});

Deno.test("should NOT sanitize errors on both branches", async () => {
  Deno.env.set("DENO_ENV", "foo");

  // resolved success
  await fork(res, 200, Async.Resolved({ ok: true }));
  assert(result.ok);

  // resolved error
  await fork(res, 200, Async.Resolved({ ok: false, originalErr: "foobar" }));
  assertEquals(result.ok, false);
  assert(result.originalErr);

  // rejected error (fatal)
  await fork(res, 200, Async.Rejected({ ok: false, originalErr: "foobar" }));
  assertEquals(result.ok, false);
  assert(result.originalErr);

  cleanup();
});
