// deno-lint-ignore-file no-unused-vars

import { assert } from './dev_deps.js'

import { data as dataPort } from './mod.js'

const adapter = dataPort({
  createDatabase: (name) => Promise.resolve({ ok: true }),
  removeDatabase: (name) => Promise.resolve({ ok: true }),
  createDocument: ({ db, id, doc }) => Promise.resolve({ ok: true, id }),
  retrieveDocument: ({ db, id }) => Promise.resolve({ ok: true, id }),
  updateDocument: ({ db, id, doc }) => Promise.resolve({ ok: true, id }),
  removeDocument: ({ db, id }) => Promise.resolve({ ok: true, id }),
  listDocuments: ({ db, limit, startkey, endkey, keys, descending }) =>
    Promise.resolve({ ok: true, docs: [] }),
  queryDocuments: (
    { db, query },
  ) => (console.log(query), Promise.resolve({ ok: true, docs: [] })),
  indexDocuments: ({ db, name, fields }) => Promise.resolve({ ok: true }),
  bulkDocuments: ({ db, docs }) => Promise.resolve({ ok: true, results: [{ ok: true, id: '1' }] }),
})

Deno.test('data port tests', async () => {
  const results = await Promise.all([
    adapter.createDatabase('foo'),
    adapter.removeDatabase('foo'),
    adapter.createDocument({ db: 'foo', id: 'bar', doc: { hello: 'world' } }),
    adapter.retrieveDocument({ db: 'foo', id: 'bar' }),
    adapter.updateDocument({ db: 'foo', id: 'bar', doc: { hello: 'mars' } }),
    adapter.removeDocument({ db: 'foo', id: 'bar' }),
    adapter.listDocuments({ db: 'foo' }),
    adapter.queryDocuments({
      db: 'foo',
      query: {
        selector: {
          id: 'bar',
        },
        fields: ['id'],
        sort: [{ id: 'DESC' }],
        limit: 10,
      },
    }),
    adapter.indexDocuments({ db: 'foo', name: 'id', fields: ['id'] }),
    adapter.bulkDocuments({ db: 'foo', docs: [{ id: '1', type: 'movie' }] }),
  ])
    .then((_) => ({ ok: true }))
    .catch((_) => {
      console.log(_)
      return ({ ok: false })
    })

  assert(results.ok)
})

Deno.test('data port - only accepts ASC or DESC for queryDocuments sort', async () => {
  const { err: errFromObject } = await adapter.queryDocuments({
    db: 'foo',
    query: {
      selector: {
        id: 'bar',
      },
      fields: ['id'],
      sort: [{ id: 'FOOOO' }],
      limit: 10,
    },
  }).catch(() => ({ err: true }))

  assert(errFromObject)

  const { err: errFromString } = await adapter.queryDocuments({
    db: 'foo',
    query: {
      selector: {
        id: 'bar',
      },
      fields: ['id'],
      sort: ['FOOOOO'],
      limit: 10,
    },
  }).catch(() => ({ err: true }))

  assert(errFromString)
})
