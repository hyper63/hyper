const { v4 } = require('uuid')
const test = require('tape')
const memory = require('./adapter')()

test('create store', async t => {
  t.plan(1)
 
  const result = await memory.createStore('default')
  t.ok(result.ok)
})

test('delete store', async t => {
  t.plan(1)
  const result = await memory.destroyStore('default')
  t.ok(result.ok)  
})

test('create doc', async t => {
  t.plan(2)
  const store = v4()
  await memory.createStore(store)
  await memory.createDoc({
    store: store,
    key: '1',
    value: {hello: 'world'}
  })
  const result = await memory.getDoc({
    store: store,
    key: '1'
  })
  t.ok(result.ok)
  t.deepEqual(result.doc, { hello: 'world'})
  await memory.destroyStore(store)
})

test('get doc', async t => {
  t.plan(2)
  const store = v4()
  await memory.createStore(store)
  await memory.createDoc({
    store,
    key: '2',
    value: {foo: 'bar'}
  })
  const result = await memory.getDoc({
    store, key: '2'
  })
  t.ok(result.ok)
  t.deepEqual(result.doc, {foo: 'bar'})
  await memory.destroyStore(store)
})


test('update doc', async t => {
  t.plan(2)
  const store = v4()
  await memory.createStore(store)
  await memory.createDoc({
    store,
    key: '2',
    value: {foo: 'bar'}
  })
  await memory.updateDoc({
    store,
    key: '2',
    value: { beep: 'boop'}
  })
  const result = await memory.getDoc({
    store, key: '2'
  })
  t.ok(result.ok)
  t.deepEqual(result.doc, {beep: 'boop'})
  await memory.destroyStore(store)
})

test('delete doc', async t => {
  t.plan(1)
  const store = v4()
  await memory.createStore(store)
  await memory.createDoc({
    store,
    key: '2',
    value: {foo: 'bar'}
  })
  await memory.deleteDoc({
    store,
    key: '2'
  })
  const result = await memory.getDoc({
    store, key: '2'
  })
  t.ok(result.ok)
  await memory.destroyStore(store)
})
