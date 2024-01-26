import { HyperRequest } from '../types.ts'
import { assert, assertEquals } from '../dev_deps.ts'

import { enqueue, errors, queued } from '../services/queue.ts'
import { create } from '../services/queue.ts'
import { destroy } from '../services/queue.ts'

const test = Deno.test

test('queue.enqueue', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'queue')
    assertEquals(h.method, 'POST')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify(h.body),
      }),
    )
  }
  const result = await enqueue({ id: 'game-1', type: 'game' })(
    mockRequest,
  )
  const body = await result.json()
  assertEquals(body.id, 'game-1')
  assertEquals(body.type, 'game')
})

test('queue.errors', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'queue')
    assertEquals(h.method, 'GET')
    return Promise.resolve(
      new Request(
        'http://localhost?' + new URLSearchParams(h.params).toString(),
        {
          method: 'GET',
        },
      ),
    )
  }
  const request = await errors()(mockRequest)
  assertEquals(request.url, 'http://localhost/?status=ERROR')
})

test('queue.queued', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'queue')
    assertEquals(h.method, 'GET')
    return Promise.resolve(
      new Request(
        'http://localhost?' + new URLSearchParams(h.params).toString(),
        {
          method: 'GET',
        },
      ),
    )
  }
  const request = await queued()(mockRequest)
  assertEquals(request.url, 'http://localhost/?status=READY')
})

test('queue.create', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'queue')
    assertEquals(h.method, 'PUT')
    return Promise.resolve(
      new Request('http://localhost', {
        method: 'PUT',
        body: JSON.stringify(h.body),
      }),
    )
  }

  const result = await create('https://foo.bar', 'shhhh')(mockRequest)
  const body = await result.json()
  assertEquals(body, { target: 'https://foo.bar', secret: 'shhhh' })

  const noSecret = await create('https://foo.bar')(mockRequest)
  const noSecertBody = await noSecret.json()
  assertEquals(noSecertBody, { target: 'https://foo.bar' })
})

test('queue.destroy', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'queue')
    assertEquals(h.method, 'DELETE')
    return Promise.resolve(
      new Request('http://localhost', { method: 'DELETE' }),
    )
  }

  await destroy(true)(mockRequest)

  const noConfirmRequest = (_h: HyperRequest) => {
    assert(false, 'unreachable')
    return Promise.resolve(
      new Request('http://localhost', { method: 'DELETE' }),
    )
  }

  await destroy()(noConfirmRequest).catch(assert)
})
