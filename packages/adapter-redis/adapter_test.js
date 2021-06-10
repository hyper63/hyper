
import { spy, resolves, assert, assertObjectMatch, assertEquals } from './dev_deps.js'

import createAdapter from './adapter.js'

const baseStubClient = {
  get: resolves(),
  set: resolves(),
  del: resolves(),
  keys: resolves(),
  scan: resolves()
}

Deno.test('test scan', async () => {
  let results = []
  for (let i = 0; i < 100; i++) {
    results.push(`key${i}`)
  }

  const adapter = createAdapter({
    ...baseStubClient,
    get: resolves(JSON.stringify({ bam: 'baz' })),
    scan: resolves(['0', results])
  })

  results = await adapter.listDocs({
    store: 'word',
    pattern: '*'
  })

  assert(results.docs.length === 100)
})

Deno.test('create redis store', async () => {
  const adapter = createAdapter(baseStubClient)

  const result = await adapter.createStore('foo')
  assert(result.ok)
})

Deno.test('remove redis store - no keys', async () => {
  const adapter = createAdapter({
    ...baseStubClient,
    keys: resolves([])
  })

  const result = await adapter.destroyStore('foo')
  assert(result.ok)
})

Deno.test('remove redis store - keys', async () => {
  const del = spy(() => Promise.resolve(2))
  const adapter = createAdapter({
    ...baseStubClient,
    del,
    keys: resolves(['baz', 'bar'])
  })

  const result = await adapter.destroyStore('foo')

  assert(result.ok)
  assertObjectMatch(del.calls[0], { args: ['store_foo'] })
  assertObjectMatch(del.calls[1], { args: ['baz', 'bar'] })
})

Deno.test('create redis doc', async () => {
  const adapter = createAdapter(baseStubClient)

  const result = await adapter.createDoc({
    store: 'foo',
    key: 'bar',
    value: { bam: 'baz' },
    ttl: 5000
  })

  assert(result.ok)
  assertEquals(result.doc, { bam: 'baz' })
})

Deno.test('get redis doc', async () => {
  const value = { bam: 'baz' }
  const adapter = createAdapter({
    ...baseStubClient,
    get: resolves(JSON.stringify(value))
  })

  const result = await adapter.getDoc({
    store: 'foo',
    key: 'bar'
  })

  assertObjectMatch(result, value)
})

Deno.test('get redis doc - not found', async () => {
  const adapter = createAdapter({
    ...baseStubClient,
    get: resolves(undefined)
  })

  // Wanted to use assertThrowsAsync, but it requires throwing an Error type
  try {
    await adapter.getDoc({
      store: 'foo',
      key: 'bar'
    })

    assert(false)
  } catch (err) {
    assertObjectMatch(err, { ok: false, status: 404 })
  }
})

Deno.test('update redis doc', async () => {
  const adapter = createAdapter(baseStubClient)

  const result = await adapter.updateDoc({
    store: 'foo',
    key: 'bar',
    value: { hello: 'world' }
  })

  assert(result.ok)
})

Deno.test('delete redis doc', async () => {
  const adapter = createAdapter(baseStubClient)

  const result = await adapter.deleteDoc({
    store: 'foo',
    key: 'bar'
  })

  assert(result.ok)
})

Deno.test('list redis docs', async () => {
  const doc = { bam: 'baz' }

  const adapter = createAdapter({
    ...baseStubClient,
    get: resolves(JSON.stringify(doc)),
    scan: resolves(['0', ['key']])
  })

  const result = await adapter.listDocs({
    store: 'foo',
    pattern: '*'
  })

  assert(result.ok)
  assertEquals(result.docs.length, 1)
  assertObjectMatch(result.docs[0].value, doc)
})
