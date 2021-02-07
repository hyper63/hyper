const test = require('tape')
const { Async } = require('crocks')
const fetchMock = require('fetch-mock')

const createAdapter = require('./adapter')
const { createHeaders, handleResponse } = require('./async-fetch')

const headers = createHeaders('admin', 'password')
const ES = 'http://localhost:9200'

const fetch = fetchMock.sandbox()
  .put(`${ES}/movies`, 
    { 
      status: 201,
      body: { ok: true },
      headers
    }
  )
  .delete(`${ES}/movies`, {
    status: 200,
    body: { ok: true },
    headers
  })
  .post(`${ES}/movies`, {
    status: 201,
    body: { ok: true },
    headers
  })
  .get(`${ES}/movies/_doc/1/_source`, {
    status: 200,
    body: { _id: '1', hello: 'world'},
    headers
  })
  .put(`${ES}/movies/_doc/1`, {
    status: 201,
    body: { ok: true },
    headers
  })

const adapter = createAdapter({
  config: { origin: ES },
  asyncFetch: Async.fromPromise(fetch),
  headers,
  handleResponse
})


test('create index', async t => {
  const result = await adapter.createIndex({ index: 'movies', mapping: {}})
  t.ok(result.ok)
  t.end()
})

test('remove index', async t => {
  const result = await adapter.deleteIndex('movies')
  t.ok(result.ok)
  t.end()
})

test('index document', async t => {
  const result = await adapter.indexDoc({
    index: 'movies', key: '1', doc: {hello: 'world'}
  })
  t.ok(result.ok)
  t.end()
})

test('get document', async t => {
  const result = await adapter.getDoc({
    index: 'movies', 
    key: '1'
  })
  
  t.equal(result.doc.hello, 'world')
  t.end()
})