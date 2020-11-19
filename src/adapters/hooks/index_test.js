import { default as test } from 'tape'
import { default as hooksAdapter } from './index.js'

test('call hooks', async t => {
  const adapter = hooksAdapter().link()()
  t.ok(adapter.call)
  t.end()
})