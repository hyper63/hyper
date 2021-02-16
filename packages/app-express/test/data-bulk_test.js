const test = require('tape')
const { Async } = require('crocks')
const app = require('../')({
  data: {
    bulkDocuments: () => Async.Resolved({ok: true, results: []})
  },
  middleware: []
})

const createTestServer = require('@twilson63/test-server')
const fetch = require('node-fetch')

test('POST /data/movies/_bulk', async t => {
  t.plan(1)
  const server = createTestServer(app)
  const res = await (await fetch(`${server.url}/data/movies/_bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{id: '1', type: 'movie'}])
  })).json()
  t.ok(res.ok)
  server.close()
})
