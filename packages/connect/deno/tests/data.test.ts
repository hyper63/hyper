import { HyperRequest } from '../types.ts'

import { assert, assertEquals } from '../dev_deps.ts'

import { add, bulk, create, destroy, get, index, query, remove, update } from '../services/data.ts'
import { HYPER_LEGACY_GET_HEADER } from '../utils/hyper-request.ts'

const test = Deno.test

test('data.add', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'POST')

    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const request = await add({ id: 'game-1', type: 'game' })(mockRequest)
  const body = await request.json()
  assertEquals(body.type, 'game')
})

test('data.get', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'GET')
    assertEquals(h.resource, 'game-1')
    assertEquals(h.headers?.get(HYPER_LEGACY_GET_HEADER), 'false')
    return Promise.resolve(new Request('http://localhost'))
  }

  await get('game-1')(mockRequest)
})

test('data.update', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'PUT')
    assertEquals(h.resource, 'game-1')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(h.body),
      }),
    )
  }

  const result = await update('game-1', { id: 'game-1', type: 'game' })(
    mockRequest,
  )
  const body = await result.json()
  assertEquals(body.type, 'game')
})

test('data.remove', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'DELETE')
    assertEquals(h.resource, 'game-1')
    return Promise.resolve(new Request('http://localhost'))
  }
  await remove('game-1')(mockRequest)
})

test('data.query', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'POST')
    assertEquals(h.action, '_query')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await query({ type: 'game' })(mockRequest)
  const body = await result.json()
  assertEquals(body.selector.type, 'game')
})

test('data.bulk', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'POST')
    assertEquals(h.action, '_bulk')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await bulk([{ id: 'game-1', type: 'game' }])(mockRequest)
  const body = await result.json()
  assertEquals(body[0].id, 'game-1')
})

test('data.index', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'POST')
    assertEquals(h.action, '_index')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await index('foo', ['type'])(mockRequest)
  const body = await result.json()
  assertEquals(body.name, 'foo')
  assertEquals(body.fields[0], 'type')

  const withSort = await index('foo', [{ type: 'ASC' }, { bar: 'ASC' }])(
    mockRequest,
  )
  const bodyWithSort = await withSort.json()
  assertEquals(bodyWithSort.name, 'foo')
  assertEquals(bodyWithSort.fields[0], { type: 'ASC' })
  assertEquals(bodyWithSort.fields[1], { bar: 'ASC' })

  const withPartialFilter = await index('foo', ['type'], { type: 'user' })(
    mockRequest,
  )
  const bodyWithPartialFilter = await withPartialFilter.json()
  assertEquals(bodyWithPartialFilter.name, 'foo')
  assertEquals(bodyWithPartialFilter.fields[0], 'type')
  assertEquals(bodyWithPartialFilter.partialFilter, { type: 'user' })
})

test('data.create', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
    assertEquals(h.method, 'PUT')
    return Promise.resolve(new Request('http://localhost', { method: 'PUT' }))
  }

  await create()(mockRequest)
})

test('data.destroy', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'data')
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
