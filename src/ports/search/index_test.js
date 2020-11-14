import { default as test } from 'tape'
import searchPort from './index'

test('port search ok', t => {
  t.plan(1)
  const search = searchPort({
    createIndex: (index, mappings) => Promise.resolve({ok: true}),
    deleteIndex: (index) => Promise.resolve({ok: true}),
    indexDoc: ({index, key, doc}) => Promise.resolve({ok: true}),
    getDoc: ({index, key}) => Promise.resolve({ok: true}),
    updateDoc: ({index, key, doc}) => Promise.resolve({ok: true}),
    removeDoc: ({index, key}) => Promise.resolve({ok: true}),
    query: ({index, q}) => Promise.resolve({ok: true, matches: []})
  })
  Promise.all([
    search.createIndex('foo', {}),
    search.deleteIndex('foo'),
    search.indexDoc({ index: 'foo', key: 'bar', doc: { hello: 'world'}}),
    search.getDoc({ index: 'foo', key: 'bar'}),
    search.updateDoc({ index: 'foo', key: 'bar', doc: { beep: 'boop'}}),
    search.removeDoc({ index: 'foo', key: 'bar'}),
    search.query({ index: 'foo', q: {}})

  ]).then(results => {
    t.ok(true)
    
  }).catch(e => {
    
    t.ok(false)
  })
  
})