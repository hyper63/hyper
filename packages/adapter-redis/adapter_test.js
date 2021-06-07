const test = require('tape')
const redis = require('redis-mock')
// const redis = require('redis')
const createAdapter = require('./adapter')

const client = redis.createClient()
const adapter = createAdapter(client)

test('test scan', async t => {
  let result = await adapter.createStore('word')
  for (let i = 0; i < 100; i++) {
    result = await adapter.createDoc({
      store: 'word',
      key: 'bar' + i,
      value: { bam: 'baz' }
    })
  }

  result = await adapter.listDocs({
    store: 'word',
    pattern: '*'
  })
  t.ok(result.docs.length === 100)
  t.end()
})

test('create redis store', async t => {
  const result = await adapter.createStore('foo')
  t.ok(result.ok)
  t.end()
})

test('remove redis store', async t => {
  const result = await adapter.destroyStore('foo')
  t.ok(result.ok)
  t.end()
})

test('create redis doc', async t => {
  const result = await adapter.createDoc({
    store: 'foo',
    key: 'bar',
    value: { bam: 'baz' }
  })
  t.ok(result.ok)
  t.end()
})

test('get redis doc', async t => {
  const result = await adapter.getDoc({
    store: 'foo',
    key: 'bar'
  })
  t.deepEqual(result, { bam: 'baz' })
  t.end()
})

test('update redis doc', async t => {
  const result = await adapter.updateDoc({
    store: 'foo',
    key: 'bar',
    value: { hello: 'world' }
  })
  t.ok(result.ok)
  t.end()
})

test('delete redis doc', async t => {
  const result = await adapter.deleteDoc({
    store: 'foo',
    key: 'bar'
  })
  t.ok(result.ok)
  t.end()
})

test('list redis docs', async t => {
  const doc = { hello: 'world' }
  await adapter.createDoc({ store: 'foo', key: 'beep', value: doc })
  const result = await adapter.listDocs({
    store: 'foo',
    pattern: '*'
  })
  await adapter.deleteDoc({
    store: 'foo',
    key: 'beep'
  })

  t.ok(result.ok)
  t.equal(result.docs.length, 1)
  t.deepEqual(result.docs[0].value, doc)
  t.end()
})
