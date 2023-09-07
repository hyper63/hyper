import { HyperRequest } from '../types.ts'

import { assert, assertEquals } from '../dev_deps.ts'

import { add, create, destroy, get, load, query, remove, update } from '../services/search.ts'

const test = Deno.test

test('search.add', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'POST')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await add('game-1', { id: 'game-1', type: 'game' })(
    mockRequest,
  )
  const body = await result.json()
  assertEquals(body.key, 'game-1')
  assertEquals(body.doc.type, 'game')
})

test('search.get', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'GET')
    assertEquals(h.resource, 'game-1')
    return Promise.resolve(new Request('http://localhost'))
  }
  await get('game-1')(mockRequest)
})

test('search.update', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'PUT')
    assertEquals(h.resource, 'game-1')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await update('game-1', { id: 'game-1', type: 'game' })(
    mockRequest,
  )
  const body = await result.json()
  assertEquals(body.id, 'game-1')
  assertEquals(body.type, 'game')
})

test('search.remove', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'DELETE')
    assertEquals(h.resource, 'game-1')
    return Promise.resolve(new Request('http://localhost'))
  }
  await remove('game-1')(mockRequest)
})

test('search.query', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'POST')
    assertEquals(h.action, '_query')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await query('game')(mockRequest)
  const body = await result.json()
  assertEquals(body.query, 'game')
})

test('search.load', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'POST')
    assertEquals(h.action, '_bulk')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await load([{ id: 'game-1', type: 'game' }])(mockRequest)
  const body = await result.json()
  assertEquals(body[0].id, 'game-1')
  assertEquals(body[0].type, 'game')
})

test('search.create', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'PUT')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(h.body),
      }),
    )
  }

  const result = await create(['title'])(mockRequest)
  const body = await result.json()
  assertEquals(body.fields[0], 'title')
})

test('search.destroy', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'search')
    assertEquals(h.method, 'DELETE')
    return Promise.resolve(
      new Request('http://localhost', { method: 'DELETE' }),
    )
  }

  await destroy(true)(mockRequest)

  const noConfirmRequest = (_h: HyperRequest) => {
    assert(false, 'unreachable')
  }

  await destroy()(noConfirmRequest).catch(assert)
})
