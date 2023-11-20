import { HyperRequest } from '../types.ts'
import { assert, assertEquals } from '../dev_deps.ts'

import { create, destroy, download, remove, signedUrl, upload } from '../services/storage.ts'

const test = Deno.test

test('storage.upload', async () => {
  const mockRequest = async (h: HyperRequest) => {
    assertEquals(h.service, 'storage')
    assertEquals(h.method, 'POST')
    const body = await new Response(h.body as ReadableStream).text()
    assertEquals(body, 'woop woop')
    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket/${h.resource}`, {
        method: 'POST',
      }),
    )
  }
  const req = await upload('bar/foo.txt', new Response('woop woop').body as ReadableStream)(
    mockRequest,
  )
  assertEquals(req.url, 'http://localhost/storage/bucket/bar/foo.txt')
})

test('storage.download', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'storage')
    assertEquals(h.method, 'GET')
    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket/${h.resource}`, {
        method: h.method,
      }),
    )
  }
  const req = await download('avatar.png')(mockRequest)
  assertEquals(req.url, 'http://localhost/storage/bucket/avatar.png')
})

test('storage.signedUrl(download)', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'storage')
    assertEquals(h.method, 'GET')
    assertEquals(h.body, undefined)
    assertEquals(h.params, { useSignedUrl: true })

    let url = `http://localhost/${h.service}/bucket/${h.resource}`
    if (h.params) {
      url += `?${new URLSearchParams(h.params).toString()}`
    }

    return Promise.resolve(
      new Request(url, {
        method: h.method,
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }),
    )
  }
  const req = await signedUrl('avatar.png', { type: 'download' })(mockRequest)
  assertEquals(
    req.url,
    'http://localhost/storage/bucket/avatar.png?useSignedUrl=true',
  )
})

test('storage.signedUrl(upload)', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'storage')
    assertEquals(h.method, 'POST')
    assertEquals(h.body, undefined)
    assertEquals(h.params, { useSignedUrl: true })

    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket/${h.resource}`, {
        method: h.method,
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }),
    )
  }
  const req = await signedUrl('avatar.png', { type: 'upload' })(mockRequest)
  assertEquals(req.headers.get('content-type'), 'application/json')
  assertEquals(req.url, 'http://localhost/storage/bucket/avatar.png')
})

test('storage.remove', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'storage')
    assertEquals(h.method, 'DELETE')
    return Promise.resolve(
      new Request(`http://localhost/${h.service}/bucket/${h.resource}`, {
        method: h.method,
      }),
    )
  }
  const req = await remove('avatar.png')(mockRequest)
  assertEquals(req.url, 'http://localhost/storage/bucket/avatar.png')
})

test('storage.create', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'storage')
    assertEquals(h.method, 'PUT')
    return Promise.resolve(new Request('http://localhost', { method: 'PUT' }))
  }

  await create()(mockRequest)
})

test('storage.destroy', async () => {
  const mockRequest = (h: HyperRequest) => {
    assertEquals(h.service, 'storage')
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
