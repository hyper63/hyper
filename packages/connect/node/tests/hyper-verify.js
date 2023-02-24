import { test } from 'uvu'
import * as assert from 'uvu/assert'

import { hmac } from '../../to-node/deps.node.js'
import { createHyperVerify } from '../../to-node/utils/hyper-verify.js'

test('Verify: Compare Secret Signatures Successfully', () => {
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
  assert.equal(result.ok, true)
})

test('Verify: Compare Signatures that don\'t match ', () => {
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
  const result = verifySignature(sig, { ok: true, type: 'msg' })
  assert.equal(result.ok, false)
  assert.equal(result.status, 401)
})

test.run()
