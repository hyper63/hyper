import crocks from 'crocks'

import { default as test } from 'tape'
import { default as createAdapter } from './adapter.js'
import fetchMock from 'fetch-mock'

const { Async } = crocks
const logDb = 'http://127.0.0.1:9200/log/_doc'

const hooks = [{
  matcher: "*",
  target: logDb
}, {
  matcher: "TEST:*",
  target: logDb
}, {
  matcher: "*:METHOD",
  target: logDb
}, {
  matcher: "FOO:BAR",
  target: logDb
}]

const fetch = fetchMock.sandbox()
  .post(`${logDb}`, 
    { 
      status: 201,
      body: { ok: true },
      headers: {'content-type': 'application/json'}
    }
  )

const asyncFetch = Async.fromPromise(fetch)

test('using hooks log event', async t => {
  const adapter = createAdapter({asyncFetch, hooks})
  const result = await adapter.call({
    type: 'TEST:METHOD',
    payload: { date: new Date().toISOString() }
  })
  t.ok(result[0].ok)
  t.equal(result.length, 3)
  t.end()
})