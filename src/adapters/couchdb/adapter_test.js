import { default as test } from 'tape'
import { Async } from 'crocks'
import { default as createAdapter } from './adapter'
import fetchMock from 'fetch-mock'
import { createHeaders, handleResponse } from './async_fetch'

const headers = createHeaders('admin', 'password')
const COUCH = 'http://localhost:5984'

const fetch = fetchMock.sandbox()
  .put(`${COUCH}/hello`, 
    { 
      status: 201,
      body: { ok: true },
      headers
    }
  )
  .delete(`${COUCH}/hello`, {
    status: 200,
    body: { ok: true },
    headers
  })
  .post(`${COUCH}/hello`, {
    status: 201,
    body: { ok: true },
    headers
  })
  .get(`${COUCH}/hello/1`, {
    status: 200,
    body: { _id: '1', hello: 'world'},
    headers
  })

const adapter = createAdapter({
  config: { origin: COUCH },
  asyncFetch: Async.fromPromise(fetch),
  headers,
  handleResponse
})


test('create database', async t => {
  const result = await adapter.createDatabase('hello')
  t.ok(result.ok)
  t.end()
})

test('remove database', async t => {
  const result = await adapter.removeDatabase('hello')
  t.ok(result.ok)
  t.end()
})

test('create document', async t => {
  const result = await adapter.createDocument({
    db: 'hello', id: '1', doc: {hello: 'world'}
  })
  t.ok(result.ok)
  t.end()
})

test('retrieve document', async t => {
  const result = await adapter.retrieveDocument({
    db: 'hello', 
    id: '1'
  })
  t.equal(result.hello, 'world')
  t.end()
})