
import { spy, resolves, assert, assertEquals, assertObjectMatch } from './dev_deps.js'

import createAdapter from './adapter.js'
import { createHeaders, handleResponse, asyncFetch } from './async-fetch.js'
import {
  deleteIndexPath, createIndexPath, indexDocPath, getDocPath,
  updateDocPath, removeDocPath, bulkPath, queryPath
} from './paths.js'

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

const response = { json: () => Promise.resolve(), status: 200 }

const stubResponse = (status, body) => {
  response.json = resolves(body)
  response.status = status
}

const fetch = spy(() => Promise.resolve(response))

const adapter = createAdapter({
  config: { origin: ES },
  asyncFetch: asyncFetch(fetch),
  headers,
  handleResponse
})

Deno.test('remove index', async () => {
  // remove index
  stubResponse(200, { ok: true })

  const result = await adapter.deleteIndex(INDEX)

  assertObjectMatch(fetch.calls.shift(), {
    args: [deleteIndexPath(ES, INDEX), {
      method: 'DELETE',
      headers
    }]
  })

  assertEquals(result.ok, true)
})

Deno.test('create index', async () => {
  // create index
  stubResponse(201, { ok: true })

  const result = await adapter.createIndex({
    index: INDEX,
    mappings: { fields: ['title'] }
  })

  assertObjectMatch(fetch.calls.shift(), {
    args: [createIndexPath(ES, INDEX), {
      method: 'PUT',
      headers,
      body: '{"mappings":{"properties":{"title":{"type":"text"}}}}'
    }]
  })

  assertEquals(result.ok, true)
})

Deno.test('index document', async () => {
  // index doc
  stubResponse(200, { ok: true })

  const result = await adapter.indexDoc({
    index: INDEX,
    key: DOC1.id,
    doc: DOC1
  })

  assertObjectMatch(fetch.calls.shift(), {
    args: [indexDocPath(ES, INDEX, DOC1.id), {
      method: 'PUT',
      headers,
      body: JSON.stringify(DOC1)
    }]
  })

  assertEquals(result.ok, true)
})

Deno.test('get document', async () => {
  // get doc
  stubResponse(200, DOC1)

  const result = await adapter.getDoc({
    index: INDEX,
    key: DOC1.id
  })

  assertObjectMatch(fetch.calls.shift(), {
    args: [getDocPath(ES, INDEX, DOC1.id), {
      method: 'GET',
      headers
    }]
  })

  assertEquals(result.doc.title, DOC1.title)
  assertEquals(result.ok, true)
})

Deno.test('update document', async () => {
  // update doc
  stubResponse(201, { ok: true })

  const result = await adapter.updateDoc({
    index: INDEX,
    key: DOC1.id,
    doc: {
      ...DOC1,
      rating: 6
    }
  })

  assertObjectMatch(fetch.calls.shift(), {
    args: [updateDocPath(ES, INDEX, DOC1.id), {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        ...DOC1,
        rating: 6
      })
    }]
  })

  assertEquals(result.ok, true)
})

Deno.test('delete document', async () => {
  // remove doc
  stubResponse(201, { ok: true })

  const result = await adapter.removeDoc({
    index: INDEX,
    key: DOC1.id
  })

  assertObjectMatch(fetch.calls.shift(), {
    args: [removeDocPath(ES, INDEX, DOC1.id), {
      method: 'DELETE',
      headers
    }]
  })

  assertEquals(result.ok, true)
})

Deno.test('bulk', async () => {
  // bulk operation
  stubResponse(200, {
    items: [
      DOC1,
      DOC2
    ]
  })

  const result = await adapter.bulk({
    index: INDEX,
    docs: [
      DOC1,
      DOC2
    ]
  })

  assertObjectMatch(fetch.calls.shift(), {
    args: [bulkPath(ES), {
      method: 'POST',
      headers
      // TODO: Tyler. Assert body here eventually
    }]
  })

  assertEquals(result.ok, true)
  assert(result.results)
})

Deno.test('query', async () => {
  // query docs
  stubResponse(200, {
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

  assertObjectMatch(fetch.calls.shift(), {
    args: [queryPath(ES, INDEX), {
      method: 'POST',
      headers
      // TODO: Tyler. Assert body here eventually
    }]
  })

  assertEquals(result.ok, true)
  assert(result.matches)
  assertEquals(result.matches.length, 1)
})
