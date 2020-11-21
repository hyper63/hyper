const test = require('tape')
const adapter = require('./adapter')('./test-data')
const { v4 } = require('uuid')

test('pouchdb adapter tests', async t => {
  t.plan(5)
  const dbName = v4()
  
  await adapter.createDatabase(dbName)
  const result = await adapter.createDocument({
    db: dbName,
    id: '1234',
    doc: {hello: 'world'}
  })
  
  t.ok(result.ok, 'create doc success')
  const doc = await adapter.retrieveDocument({
    db: dbName,
    id: '1234'
  })
  
  t.deepEqual(doc, {hello: 'world', id: '1234'}, 'verify get doc')

  const updateResult = await adapter.updateDocument({
    db: dbName,
    id: '1234',
    doc: {foo: 'bar'}
  })
  t.ok(updateResult.ok, 'update doc success')
  
  const newDoc = await adapter.retrieveDocument({
    db: dbName,
    id: '1234'
  })
  t.deepEqual(newDoc, {foo: 'bar', id: '1234'}, 'verify updated doc')

  const deleteResult = await adapter.removeDocument({
    db: dbName,
    id: '1234'
  })
  
  t.ok(deleteResult.ok, 'delete document')
  await adapter.removeDatabase(dbName)
})