// deno-lint-ignore-file no-unused-vars ban-ts-comment
import { assert, assertRejects, Buffer } from './dev_deps.ts'

import { storage, type StoragePort } from './mod.ts'

const impl: StoragePort = {
  makeBucket: (name) => Promise.resolve({ ok: true }),
  removeBucket: (name) => Promise.resolve({ ok: true }),
  listBuckets: () => Promise.resolve({ ok: true, buckets: ['foo'] }),
  putObject: ({ bucket, object, stream }) => Promise.resolve({ ok: true }),
  removeObject: ({ bucket, object }) => Promise.resolve({ ok: true }),
  getObject: ({ bucket, object }) => Promise.resolve({ ok: true }),
  listObjects: ({ bucket, prefix }) => Promise.resolve({ ok: true, objects: ['foo.jpg'] }),
}

Deno.test('storage', async (t) => {
  let adapter = storage(impl)

  await t.step('makeBucket', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.makeBucket('foo'))
      // @ts-ignore
      await assertRejects(() => adapter.makeBucket(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.makeBucket('foo')).ok)

      const withBadOutput = storage({
        ...impl,
        makeBucket: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.makeBucket('foo'))
    })
  })

  await t.step('removeBucket', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.removeBucket('foo'))
      // @ts-ignore
      await assertRejects(() => adapter.removeBucket(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.removeBucket('foo')).ok)

      const withBadOutput = storage({
        ...impl,
        removeBucket: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.removeBucket('foo'))
    })
  })

  await t.step('listBuckets', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.listBuckets())
    })

    await t.step('should validate the outputs', async () => {
      // @ts-ignore
      assert((await adapter.listBuckets('foo')).buckets.length)

      const withBadOutput = storage({
        ...impl,
        listBuckets: () => Promise.resolve({ ok: true, buckets: [123] }),
      })
      await assertRejects(() => withBadOutput.listBuckets('foo'))
    })
  })

  await t.step('putObject', async (t) => {
    await t.step('always validate \'bucket\' and \'object\' params', async () => {
      let err = await adapter
        .putObject({
          bucket: 'foo',
          // @ts-ignore
          no_object: 'bar.jpg',
          stream: new Buffer(new Uint8Array(4).buffer),
        })
        .catch(() => ({ ok: false }))

      assert(!err.ok)

      err = await adapter
        .putObject({
          // @ts-ignore
          no_bucket: 'foo',
          object: 'bar.jpg',
          useSignedUrl: true,
        })
        .catch(() => ({ ok: false }))

      assert(!err.ok)
    })

    await t.step('upload', async (t) => {
      // happy
      await t.step('happy', async () => {
        const res = await adapter.putObject({
          bucket: 'foo',
          object: 'bar.jpg',
          stream: new Buffer(new Uint8Array(4).buffer),
        })

        assert(res.ok)
        assert(!res.url)
      })

      await t.step('nil stream', async () => {
        const err = await adapter
          .putObject({
            bucket: 'foo',
            object: 'bar.jpg',
            stream: null,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)
      })

      await t.step('conflicting params', async () => {
        // conflicting params by passing both useSignedUrl: true and stream
        const err = await adapter
          // @ts-ignore
          .putObject({
            bucket: 'foo',
            object: 'bar.jpg',
            stream: new Buffer(new Uint8Array(4).buffer),
            useSignedUrl: true,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)
      })

      await t.step('invalid return', async () => {
        // invalid return
        adapter = storage({
          ...impl,
          putObject: () => Promise.resolve({ ok: true, url: 'https://foo.ar' }),
        })

        const err = await adapter
          .putObject({
            bucket: 'foo',
            object: 'bar.jpg',
            stream: new Buffer(new Uint8Array(4).buffer),
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)

        // cleanup
        adapter = storage(impl)
      })
    })

    await t.step('signedUrl', async (t) => {
      await t.step('happy', async () => {
        adapter = storage({
          ...impl,
          putObject: () => Promise.resolve({ ok: true, url: 'https://foo.ar' }),
        })

        // happy
        const res = await adapter.putObject({
          bucket: 'foo',
          object: 'bar.jpg',
          useSignedUrl: true,
        })

        assert(res.ok)
        assert(res.url)

        // cleanup
        adapter = storage(impl)
      })

      await t.step('invalid useSignedUrl false', async () => {
        adapter = storage({
          ...impl,
          putObject: () => Promise.resolve({ ok: true, url: 'https://foo.ar' }),
        })

        // useSignedUrl false
        const err = await adapter
          .putObject({
            bucket: 'foo',
            object: 'bar.jpg',
            useSignedUrl: false,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)

        // cleanup
        adapter = storage(impl)
      })

      await t.step('conflicting params', async () => {
        adapter = storage({
          ...impl,
          putObject: () => Promise.resolve({ ok: true, url: 'https://foo.ar' }),
        })

        // conflicting params by passing both useSignedUrl: true and stream
        const err = await adapter
          // @ts-ignore
          .putObject({
            bucket: 'foo',
            object: 'bar.jpg',
            stream: new Buffer(new Uint8Array(4).buffer),
            useSignedUrl: true,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)

        // cleanup
        adapter = storage(impl)
      })

      await t.step('invalid url in return', async () => {
        adapter = storage({
          ...impl,
          putObject: () => Promise.resolve({ ok: true, url: 'not.a.url' }),
        })

        const err = await adapter
          .putObject({
            bucket: 'foo',
            object: 'bar.jpg',
            useSignedUrl: true,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)

        // cleanup
        adapter = storage(impl)
      })

      await t.step('no url in return', async () => {
        const err = await adapter
          .putObject({
            bucket: 'foo',
            object: 'bar.jpg',
            useSignedUrl: true,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)
      })
    })
  })

  await t.step('removeObject', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.removeObject({ bucket: 'foo', object: 'bar.png' }))
      // @ts-ignore
      await assertRejects(() => adapter.removeObject({ bucket: 123, object: 'bar.png' }))
      // @ts-ignore
      await assertRejects(() => adapter.removeObject({ bucket: 'foo', object: 123 }))
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (await adapter.removeObject({ bucket: 'foo', object: 'bar.png' })).ok,
      )

      const withBadOutput = storage({
        ...impl,
        removeObject: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.removeObject({ bucket: 'foo', object: 'bar.png' }))
    })
  })

  await t.step('getObject', async (t) => {
    await t.step('always validate \'bucket\' and \'object\' params', async () => {
      let err = await adapter
        .getObject({
          bucket: 'foo',
          // @ts-ignore
          no_object: 'bar.jpg',
        })
        .catch(() => ({ ok: false }))

      assert(!err.ok)

      err = await adapter
        .getObject({
          // @ts-ignore
          no_bucket: 'foo',
          object: 'bar.jpg',
          useSignedUrl: true,
        })
        .catch(() => ({ ok: false }))

      assert(!err.ok)
    })

    await t.step('download', async (t) => {
      await t.step('happy', async () => {
        const res = await adapter.getObject({
          bucket: 'foo',
          object: 'bar.jpg',
        })

        assert(res.ok)
        assert(!res.url)
      })

      await t.step('useSignedUrl is false', async () => {
        const res = await adapter.getObject({
          bucket: 'foo',
          object: 'bar.jpg',
          useSignedUrl: false,
        })

        assert(res.ok)
        assert(!res.url)
      })
    })

    await t.step('useSignedUrl', async (t) => {
      await t.step('happy', async () => {
        adapter = storage({
          ...impl,
          getObject: () => Promise.resolve({ ok: true, url: 'https://foo.ar' }),
        })

        const res = await adapter.getObject({
          bucket: 'foo',
          object: 'bar.jpg',
          useSignedUrl: true,
        })

        assert(res.ok)
        assert(res.url)
      })

      await t.step('invalid url', async () => {
        adapter = storage({
          ...impl,
          getObject: () => Promise.resolve({ ok: true, url: 'not.a.url' }),
        })

        const err = await adapter
          .getObject({
            bucket: 'foo',
            object: 'bar.jpg',
            useSignedUrl: true,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)

        // cleanup
        adapter = storage(impl)
      })

      await t.step('no url', async () => {
        adapter = storage({
          ...impl,
          getObject: () => Promise.resolve({ ok: true }),
        })

        const err = await adapter
          .getObject({
            bucket: 'foo',
            object: 'bar.jpg',
            useSignedUrl: true,
          })
          .catch(() => ({ ok: false }))

        assert(!err.ok)

        // cleanup
        adapter = storage(impl)
      })
    })
  })

  await t.step('listObjects', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.listObjects({ bucket: 'foo', prefix: 'bar' }))
      // @ts-ignore
      await assertRejects(() => adapter.listObjects({ bucket: 123, prefix: 'bar' }))
      // @ts-ignore
      await assertRejects(() => adapter.listObjects({ bucket: 'foo', prefix: 123 }))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.listObjects({ bucket: 'foo', prefix: 'bar' })).ok)

      const withBadOutput = storage({
        ...impl,
        listObjects: () => Promise.resolve({ ok: true, no_objects: [123] }),
      })
      await assertRejects(() => withBadOutput.listObjects({ bucket: 'foo', prefix: 'bar.png' }))
    })
  })
})
