import { test } from "uvu";
import * as assert from "uvu/assert";
import { createHmac } from "crypto";
import { createHyperVerify } from "../src/utils/hyper-verify.ts";

const hmac = (alg: "sha256", secret: string, data: string) => {
  const result = createHmac(alg, secret);
  result.update(data);
  return result.digest("hex");
};

test("Verify: Compare Secret Signatures Successfully", () => {
  const time = new Date();
  const s = hmac(
    "sha256",
    "batman",
    `${time}.${JSON.stringify({ ok: true, type: "msg" })}`,
  );
  const sig = `t=${time},sig=${s}`;
  const verifySignature = createHyperVerify("batman", "5m");
  const result = verifySignature(sig, { ok: true, type: "msg" });
  assert.is(result.ok, true);
});

test("Verify: Compare Signatures that don't match ", () => {
  const time = new Date();
  const s = hmac(
    "sha256",
    "batman",
    `${time}.${JSON.stringify({ ok: true, type: "msg" })}`,
  );
  const sig = `t=${time},sig=${s}`;
  const verifySignature = createHyperVerify("joker", "5m");
  const result = verifySignature(sig, { ok: true, type: "msg" });
  assert.is(result.ok, false);
  assert.is(result.status, 401);
});

test.run();
