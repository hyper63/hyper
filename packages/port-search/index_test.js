/* eslint-disable @typescript-eslint/no-unused-vars */

const test = require('tape')
const searchPort = require('./index.js')

test('port search ok', t => {
  t.plan(1)
  const search = searchPort({
    createIndex: ({ index, mappings }) => Promise.resolve({ ok: true }),
    deleteIndex: (index) => Promise.resolve({ ok: true }),
    indexDoc: ({ index, key, doc }) => Promise.resolve({ ok: true }),
    getDoc: ({ index, key }) => Promise.resolve({ ok: true, key, doc: { hello: 'world' } }),
    updateDoc: ({ index, key, doc }) => Promise.resolve({ ok: true }),
    removeDoc: ({ index, key }) => Promise.resolve({ ok: true }),
    bulk: ({ index, docs }) => Promise.resolve({ ok: true, results: [] }),
    query: ({ index, q }) => Promise.resolve({ ok: true, matches: [] })
  })
  Promise.all([
    search.createIndex({ index: 'foo', mappings: {} }),
    search.deleteIndex('foo'),
    search.indexDoc({ index: 'foo', key: 'bar', doc: { hello: 'world' } }),
    search.getDoc({ index: 'foo', key: 'bar' }),
    search.updateDoc({ index: 'foo', key: 'bar', doc: { beep: 'boop' } }),
    search.removeDoc({ index: 'foo', key: 'bar' }),
    search.bulk({ index: 'foo', docs: [] }),
    search.query({ index: 'foo', q: { query: 'foo' } })

  ]).then(results => {
    t.ok(true)
  }).catch(e => {
    console.log(e)
    t.ok(false)
  })
})
