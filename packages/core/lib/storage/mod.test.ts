// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks } from '../../deps.ts'
import { assertEquals } from '../../dev_deps.ts'

import builder from './mod.ts'

const mockService = {
  makeBucket(name: any) {
    return Promise.resolve({ ok: true, name })
  },
  removeBucket(name: any) {
    return Promise.resolve({ ok: true, name })
  },
  listBuckets(arg: any) {
    return Promise.resolve({ ok: true, arg })
  },
  putObject({ bucket, object, stream, useSignedUrl }: any) {
    return Promise.resolve({ ok: true, bucket, object, stream, useSignedUrl })
  },
  getObject({ bucket, object, useSignedUrl }: any) {
    return Promise.resolve({ ok: true, bucket, object, useSignedUrl })
  },
  removeObject({ bucket, object }: any) {
    return Promise.resolve({ ok: true, bucket, object })
  },
  listObjects({ bucket, prefix }: any) {
    return Promise.resolve({ ok: true, bucket, prefix })
  },
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('storage', async (t) => {
  const storage = builder({
    storage: mockService,
    events: mockEvents,
  } as unknown as any)

  await t.step('listBuckets', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await storage
        .listBuckets()
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.arg, undefined)
        })
        .toPromise()
    })
  })

  await t.step('makeBucket', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await storage
        .makeBucket('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .toPromise()
    })
  })

  await t.step('removeBucket', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await storage
        .removeBucket('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .toPromise()
    })
  })

  await t.step('putObject', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await storage
        .putObject(
          'foobar',
          'foo.json',
          new Response(JSON.stringify({ foo: 'bar' })).body as ReadableStream,
          false,
        )
        .chain(
          crocks.Async.fromPromise(async (res) => {
            const json = await new Response(res.stream).json()
            assertEquals(res.bucket, 'foobar')
            assertEquals(res.object, 'foo.json')
            assertEquals(res.useSignedUrl, false)
            assertEquals(json, { foo: 'bar' })
          }),
        )
        .toPromise()
    })
  })

  await t.step('getObject', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await storage
        .getObject('foobar', 'foo.json', true)
        .map((res) => {
          assertEquals(res.bucket, 'foobar')
          assertEquals(res.object, 'foo.json')
          assertEquals(res.useSignedUrl, true)
        })
        .toPromise()
    })
  })

  await t.step('removeObject', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await storage
        .removeObject('foobar', 'foo.json')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.bucket, 'foobar')
          // @ts-expect-error
          assertEquals(res.object, 'foo.json')
        })
        .toPromise()
    })
  })

  await t.step('listObjects', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await storage
        .listObjects('foobar', 'foo.json')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.bucket, 'foobar')
          // @ts-expect-error
          assertEquals(res.prefix, 'foo.json')
        })
        .toPromise()
    })
  })
})
