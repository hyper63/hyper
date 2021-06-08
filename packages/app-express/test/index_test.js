const test = require('tape')
const app = require('../')({
  middleware: []
})
const createTestServer = require('@twilson63/test-server')
const fetch = require('node-fetch')
const noop = () => null

test('GET /', async t => {
  t.plan(1)
  const server = createTestServer(app)
  const res = await (await fetch(`${server.url}`)).json()
  t.equal(res.name, 'hyper63')
  server.close(noop)
})
