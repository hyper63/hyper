const test = require('tape')
const hooksAdapter = require('./index.js')

test('call hooks', async t => {
  const adapter = hooksAdapter().link()()
  t.ok(adapter.call)
  t.end()
})