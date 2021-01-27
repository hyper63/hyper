const test = require('tape')
const adapter = require('./adapter')()

test('minisearch tests', async t => {
  t.plan(10)
  const result = await adapter.createIndex({
    index: 'default', 
    mappings: {
      fields: ['title', 'body'],
      storeFields: ['title', 'body', 'category']
    }
  })
  t.ok(result.ok, 'create index')

  const result2 = await adapter.indexDoc({
    index: 'default',
    key: '1',
    doc: {
      id: '1',
      title: 'Search is fun',
      body: 'This is a search post about cool and exciting stuff',
      category: 'search'
    }
  })

  t.ok(result2.ok, 'index doc')

  const result3 = await adapter.getDoc({
    index: 'default',
    key: '1'
  })
  t.equal(result3.id, '1', 'get document')

  const result4 = await adapter.updateDoc({
    index: 'default',
    key: '1',
    doc: {
      id: '1',
      title: 'Search is cool',
      body: 'This is a search post and it is fun',
      category: 'search'
    }
  })

  t.ok(result4.ok)

  const newDoc = await adapter.getDoc({
    index: 'default',
    key: '1'
  })
  
  t.equal(newDoc.title, 'Search is cool')

  const searchResults = await adapter.query({
    index: 'default',
    q: { query: 'Search is cool' }
  })

  t.equal(searchResults.matches[0].id, '1', 'found doc')

  const searchResults2 = await adapter.query({
    index: 'default', 
    q: { 
      query: 'Search is cool', 
      filter: {category: 'search'}
    }
  })

  t.equal(searchResults2.matches[0].id, '1', 'found doc')

  const docDeleteResult = await adapter.removeDoc({
    index: 'default',
    key: '1'
  })
  t.ok(docDeleteResult.ok, 'deleted doc')

  const deletedDoc = await adapter.getDoc({
    index: 'default',
    key: '1'
  })
  
  t.equal(deletedDoc, null, 'could not find doc')

  const deleteResult = await adapter.deleteIndex('default')
  t.ok(deleteResult.ok, 'delete index')
  
})