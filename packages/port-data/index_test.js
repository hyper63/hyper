const test = require('tape')
const dataPort = require('./index.js')

test('data port tests', async t => {
  const adapter = dataPort({
    createDatabase: (name) => Promise.resolve({ok: true}),
    removeDatabase: (name) => Promise.resolve({ok: true}),
    createDocument: ({db, id, doc}) => Promise.resolve({ok: true, id}),
    retrieveDocument: ({db, id}) => Promise.resolve({ok: true, id}),
    updateDocument: ({db, id, doc}) => Promise.resolve({ok: true, id}),
    removeDocument: ({db, id}) => Promise.resolve({ok: true, id}),
    listDocuments: ({db, limit, startkey, endkey, keys, descending}) => Promise.resolve({ok: true, docs: []}),
    queryDocuments: ({db, query}) => Promise.resolve({ok: true, docs: []}),
    indexDocuments: ({db, name, fields}) => Promise.resolve({ok: true})
  })

  const results = await Promise.all([
    adapter.createDatabase('foo'),
    adapter.removeDatabase('foo'),
    adapter.createDocument({db:'foo', id: 'bar', doc: {hello: 'world'}}),
    adapter.retrieveDocument({db: 'foo', id: 'bar'}),
    adapter.updateDocument({db: 'foo', id: 'bar', doc: {hello: 'mars'}}),
    adapter.removeDocument({db: 'foo', id: 'bar'}),
    adapter.listDocuments({db: 'foo'}),
    adapter.queryDocuments({db: 'foo', query: {
      selector: {
        id: 'bar'
      }
    }}),
    adapter.indexDocuments({db: 'foo', name: 'id', fields: ['id']})
  ])
    .then(_ => ({ok: true}))
    .catch(_ => {
      console.log(_)
      return ({ok: false})
    })
  

  t.ok(results.ok)

  t.end()
})