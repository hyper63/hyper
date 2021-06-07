
const test = require('tape')
const { Async } = require('crocks')
const fetchMock = require('fetch-mock')

const createAdapter = require('./adapter')
const { createHeaders, handleResponse } = require('./async-fetch')
const {
  deleteIndexPath, createIndexPath, indexDocPath, getDocPath,
  updateDocPath, removeDocPath, bulkPath, queryPath
} = require('./paths')

const headers = createHeaders('admin', 'password')

const ES = 'http://localhost:9200'
const INDEX = 'movies'

const DOC1 = {
  title: 'The Great Gatsby',
  id: 'tgg',
  year: 2012,
  rating: 4
}

const DOC2 = {
  title: 'The Foo Gatsby',
  id: 'tfg',
  year: 2012,
  rating: 6
}

const fetch = fetchMock.sandbox()

const adapter = createAdapter({
  config: { origin: ES },
  asyncFetch: Async.fromPromise(fetch),
  headers,
  handleResponse
})

test('remove index', async t => {
  // remove index
  fetch.deleteOnce(deleteIndexPath(ES, INDEX), {
    status: 200,
    body: { ok: true },
    headers
  })

  const result = await adapter.deleteIndex(INDEX)

  t.equals(result.ok, true)
  t.end()
})

test('create index', async t => {
  // create index
  fetch.putOnce(createIndexPath(ES, INDEX),
    {
      status: 201,
      body: { ok: true },
      headers
    }
  )

  const result = await adapter.createIndex({
    index: INDEX,
    mappings: { fields: ['title'] }
  })

  t.equals(result.ok, true)
  t.end()
})

test('index document', async t => {
  // index doc
  fetch.putOnce(indexDocPath(ES, INDEX, DOC1.id), {
    status: 200,
    body: { ok: true },
    headers
  }, {
    overwriteRoutes: true
  })

  const result = await adapter.indexDoc({
    index: INDEX,
    key: DOC1.id,
    doc: DOC1
  })

  t.equals(result.ok, true)
  t.end()
})

test('get document', async t => {
  // get doc
  fetch.getOnce(getDocPath(ES, INDEX, DOC1.id), {
    status: 200,
    body: DOC1,
    headers
  })

  const result = await adapter.getDoc({
    index: INDEX,
    key: DOC1.id
  })

  t.equals(result.doc.title, DOC1.title)
  t.equals(result.ok, true)
  t.end()
})

test('update document', async t => {
  // update doc
  fetch.putOnce(updateDocPath(ES, INDEX, DOC1.id), {
    status: 201,
    body: { ok: true },
    headers
  }, {
    overwriteRoutes: true
  })

  const result = await adapter.updateDoc({
    index: INDEX,
    key: DOC1.id,
    doc: {
      ...DOC1,
      rating: 6
    }
  })

  t.equals(result.ok, true)
  t.end()
})

test('delete document', async t => {
  // remove doc
  fetch.deleteOnce(removeDocPath(ES, INDEX, DOC1.id), {
    status: 201,
    body: { ok: true },
    headers
  })

  const result = await adapter.removeDoc({
    index: INDEX,
    key: DOC1.id
  })

  t.equals(result.ok, true)
  t.end()
})

test('bulk', async t => {
  // bulk operation
  fetch.postOnce(bulkPath(ES), {
    status: 200,
    body: {
      items: [
        DOC1,
        DOC2
      ]
    },
    headers
  })

  const result = await adapter.bulk({
    index: INDEX,
    docs: [
      DOC1,
      DOC2
    ]
  })

  t.equals(result.ok, true)
  t.ok(result.results)
  t.end()
})

test('query', async t => {
  // query docs
  fetch.postOnce(queryPath(ES, INDEX), {
    status: 200,
    hits: {
      hits: [
        DOC1
      ]
    }
  })

  const result = await adapter.query({
    index: 'movies',
    q: {
      query: 'gatsby',
      fields: ['title'],
      filter: {
        rating: 4
      }
    }
  })

  t.equals(result.ok, true)
  t.ok(result.matches)
  t.equals(result.matches.length, 1)
  t.end()
})
