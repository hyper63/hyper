const test = require('tape')
const createAdapter = require('./adapter')
const { v4 } = require('uuid')
const faker = require('faker')
const { times } = require('ramda')

test('pouchdb add bulk docs non objects', async t => {
  const adapter = createAdapter('/tmp')
  const dbName = v4()
  await adapter.createDatabase(dbName)

  const result = await adapter.bulkDocuments({
    db: dbName,
    docs: [1, 2, 3]
  }).catch(e => e)
  t.notOk(result.ok)
  t.equal(result.msg, 'documents must be objects')
  const r = await adapter.listDocuments({ db: dbName })
  console.log(r)
  t.end()
})

test('pouchdb add bulk docs db not found', async t => {
  const adapter = createAdapter('/tmp')
  const dbName = v4()
  const result = await adapter.bulkDocuments({
    db: 'foo',
    docs: [
      { id: '1', type: 'movie', title: 'Ghostbusters' },
      { id: '2', type: 'movie', title: 'Groundhog Day' },
      { id: '3', _deleted: true }
    ]
  }).catch(e => e)
  t.notOk(result.ok)

  t.equal(result.msg, 'db not found')

  t.end()
})
test('pouchdb add bulk docs no db', async t => {
  const adapter = createAdapter('/tmp')
  const dbName = v4()
  const result = await adapter.bulkDocuments({
    db: null,
    docs: [
      { id: '1', type: 'movie', title: 'Ghostbusters' },
      { id: '2', type: 'movie', title: 'Groundhog Day' },
      { id: '3', _deleted: true }
    ]
  }).catch(e => e)
  t.notOk(result.ok)

  t.equal(result.msg, 'db not defined')

  t.end()
})

test('pouchdb add bulk docs', async t => {
  const adapter = createAdapter('/tmp')
  const dbName = v4()
  await adapter.createDatabase(dbName)
  await adapter.createDocument({
    db: dbName,
    id: '2',
    doc: { hello: 'world' }
  })

  await adapter.createDocument({
    db: dbName,
    id: '3',
    doc: { hello: 'world' }
  })

  const result = await adapter.bulkDocuments({
    db: dbName,
    docs: [
      { id: '1', type: 'movie', title: 'Ghostbusters' },
      { id: '2', type: 'movie', title: 'Groundhog Day' },
      { id: '3', _deleted: true }
    ]
  })
  t.ok(result.ok)
  t.equal(result.results.length, 3)

  await adapter.removeDocument({
    db: dbName,
    id: '2'
  })

  t.end()
})

test('pouchdb create same db', async t => {
  const adapter = createAdapter('/tmp')
  const dbName = v4()
  await adapter.createDatabase(dbName)
  const result = await adapter.createDatabase(dbName).catch(e => e)
  console.log(result)
  t.ok(true)
  t.end()
})
test('pouchdb find', async t => {
  const adapter = createAdapter('/tmp')
  const dbName = v4()
  await adapter.createDatabase(dbName)
  await adapter.createDocument({
    db: dbName,
    id: v4(),
    doc: {
      username: 'twilson63',
      name: 'Tom Wilson'
    }
  })
  await Promise.all(
    times(() => adapter.createDocument({
      db: dbName,
      id: v4(),
      doc: faker.helpers.createCard()
    }), 10)
  )

  const results = await adapter.listDocuments({
    db: dbName,
    limit: 5
  })
  t.equal(results.docs.length, 5)

  const idx = await adapter.indexDocuments({
    db: dbName,
    name: 'username',
    fields: ['username']
  })

  const searchResults = await adapter.queryDocuments({
    db: dbName,
    query: {
      selector: {
        username: 'twilson63'
      },
      use_index: 'username'
    }
  })

  await adapter.removeDatabase(dbName)
  t.ok(searchResults.ok)
  t.end()
})

test('pouchdb adapter tests', async t => {
  t.plan(5)
  const adapter = createAdapter('/tmp')
  const dbName = v4()

  await adapter.createDatabase(dbName)
  const result = await adapter.createDocument({
    db: dbName,
    id: '1234',
    doc: { hello: 'world' }
  })

  t.ok(result.ok, 'create doc success')
  const doc = await adapter.retrieveDocument({
    db: dbName,
    id: '1234'
  })

  t.deepEqual(doc, { hello: 'world', id: '1234' }, 'verify get doc')

  const updateResult = await adapter.updateDocument({
    db: dbName,
    id: '1234',
    doc: { foo: 'bar' }
  })
  t.ok(updateResult.ok, 'update doc success')

  const newDoc = await adapter.retrieveDocument({
    db: dbName,
    id: '1234'
  })
  t.deepEqual(newDoc, { foo: 'bar', id: '1234' }, 'verify updated doc')

  const deleteResult = await adapter.removeDocument({
    db: dbName,
    id: '1234'
  })

  t.ok(deleteResult.ok, 'delete document')
  await adapter.removeDatabase(dbName)
})
