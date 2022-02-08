import { hmac } from "../deps.ts";
import { createHyperVerify } from "../utils/hyper-verify.ts";
import { assertEquals } from "../dev_deps.ts";

Deno.test("Compare Secret Signatures", () => {
  const time = new Date();
  const s = hmac(
    "sha256",
    "batman",
    `${time}.${JSON.stringify({ ok: true, type: "msg" })}`,
    "utf8",
    "hex",
  );
  const sig = `t=${time},sig=${s}`;
  const verifySignature = createHyperVerify("batman", "5m");
  const result = verifySignature(sig, { ok: true, type: "msg" });
  console.log(result);
  assertEquals(result.ok, true);
});
