import { hmac } from '../deps.deno.ts'
import { assertEquals } from '../dev_deps.ts'
import { NotOkResult } from '../types.ts'
import { createHyperVerify } from '../utils/hyper-verify.ts'

Deno.test('Verify: Compare Secret Signatures Successfully', () => {
  const time = new Date()
  const s = hmac(
    'sha256',
    'batman',
    `${time}.${JSON.stringify({ ok: true, type: 'msg' })}`,
    'utf8',
    'hex',
  )
  const sig = `t=${time},sig=${s}`
  const verifySignature = createHyperVerify('batman', '5m')
  const result = verifySignature(sig, { ok: true, type: 'msg' })
  assertEquals(result.ok, true)
})

Deno.test('Verify: Compare Signatures that don\'t match ', () => {
  const time = new Date()
  const s = hmac(
    'sha256',
    'batman',
    `${time}.${JSON.stringify({ ok: true, type: 'msg' })}`,
    'utf8',
    'hex',
  )
  const sig = `t=${time},sig=${s}`
  const verifySignature = createHyperVerify('joker', '5m')
  const result = verifySignature(sig, { ok: true, type: 'msg' }) as NotOkResult
  assertEquals(result.ok, false)
  assertEquals(result.status, 401)
})

/* need to figure out the best way to test this one -tnw
Deno.test("Verify: Compare Signatures old signature ", () => {
  const time = new Date();
  const s = hmac(
    "sha256",
    "batman",
    `${time}.${JSON.stringify({ ok: true, type: "msg" })}`,
    "utf8",
    "hex",
  );
  const sig = `t=${time},sig=${s}`;
  const verifySignature = createHyperVerify("batman", "0s");
  const result = verifySignature(sig, { ok: true, type: "msg" });
  assertEquals(result.ok, false);
  assertEquals(result.status, 422);
});
*/
