const test = require('tape')
const { Async } = require('crocks')

const fetchMock = require('fetch-mock')
const { createHeaders, handleResponse } = require('./async_fetch')

const headers = createHeaders('admin', 'password')
const COUCH = 'http://localhost:5984'

globalThis.fetch = fetchMock.sandbox()
  .get(`${COUCH}/hello`, { status: 200, body: { db_name: 'hello' }})
  .put(`${COUCH}/hello`, { status: 201, body: { ok: true }, headers })
  .put(`${COUCH}/hello/_security`, { status: 200, body: {ok: true}, headers })
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
  .post(`${COUCH}/hello/_find`, {
    status: 200,
    body: {
      docs: [{
        _id: '1',
        hello: 'world'
      }]
    }
  })
  .post(`${COUCH}/hello/_index`, {
    status: 200,
    body: {
      result: 'created',
      id: '_design/foo',
      name: 'foo'
    }
  })
  .post(`${COUCH}/hello/_all_docs`, {
    status: 200,
    body: {
      ok: true,
      rows: [{
        key: '1',
        value: { _id: '1', _rev: '1'},
        doc: {
          _id: '1', 
          _rev: '1',
          hello: 'world'
        }
      }]
    }
  })
  .get(`${COUCH}/hello/_all_docs?keys=1,2`, {
    status: 200,
    body: {
      ok: true,
      rows:[{
        key: '1',
        id: '1', 
        value: { rev: '1' },
      },{
        key: '2',
        id: '2',
        value: { rev: '1' }
      }]
    }
  })
  .post(`${COUCH}/hello/_bulk_docs`, {
    status: 200,
    body: [{
      ok: true,
      id: '1',
      rev: '1'
    },{
      ok: true,
      id: '2',
      rev: '2'
    }]
  })

const createAdapter = require('./adapter')
const adapter = createAdapter({
  config: { origin: COUCH },
  asyncFetch: Async.fromPromise(fetch),
  headers,
  handleResponse
})

test('bulk documents', async t => {
  const result = await adapter.bulkDocuments({
    db:'hello',
    docs: [{id: '1'},{id: '2'}]
  })

  t.ok(result.ok)
  t.equal(result.results.length, 2)
  t.end()
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

test('can not create design document', async t => {
  try {
    const result = await adapter.createDocument({
      db: 'hello', id: '_design/1', doc: {hello: 'world'}
    })
  } catch (e) {
    t.ok(!e.ok)
    t.end()
  }
})

test('retrieve document', async t => {
  const result = await adapter.retrieveDocument({
    db: 'hello', 
    id: '1'
  })
  t.equal(result.hello, 'world')
  t.end()
})

test('find documents', async t => {
  const results = await adapter.queryDocuments({
    db: 'hello',
    query: {
      selector: {
        id: '1'
      }
    }
  })
  t.deepEqual(results.docs[0], {
    id: '1', 
    hello: 'world'
  })
  t.end()
})

test('create query index', async t => {
  const results = await adapter.indexDocuments({
    db: 'hello',
    name: 'foo', 
    fields: ['foo']
  })
  t.ok(results.ok)
  t.end()
})

test('list documents', async t => {
  const results = await adapter.listDocuments({
    db: 'hello',
    limit: 1
  })
  t.deepEqual(results.docs[0], {
    id: '1', 
    hello: 'world'
  })
})
