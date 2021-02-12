const test = require('tape')
const app = require('../')({ middleware: [] })
const createServer = require('@twilson63/test-server')
const fetch = require('node-fetch')
const noop = () => null

test('GET /error', async t => {
  t.plan(1)
  const server = createServer(app)
  const res = await (await fetch(`${server.url}/error`)).json()

  t.equal(res.ok,false)
  server.close(noop)
})
