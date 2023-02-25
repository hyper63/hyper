// deno-lint-ignore-file no-unused-vars ban-ts-comment
import { assert, assertRejects } from './dev_deps.ts'

import { cache, type CachePort } from './mod.ts'

const impl: CachePort = {
  createStore(name) {
    return Promise.resolve({ ok: true })
  },
  destroyStore(name) {
    return Promise.resolve({ ok: true })
  },
  createDoc({ store, key, value, ttl }) {
    return Promise.resolve({ ok: true })
  },
  getDoc({ store, key }) {
    return Promise.resolve({ ok: true, doc: { beep: 'boop' } })
  },
  updateDoc({ store, key, value, ttl }) {
    return Promise.resolve({ ok: true })
  },
  deleteDoc({ store, key }) {
    return Promise.resolve({ ok: true })
  },
  listDocs({ store, pattern }) {
    return Promise.resolve({ ok: true, docs: [{ beep: 'boop' }] })
  },
  index() {
    return Promise.resolve([])
  },
}

Deno.test('cache', async (t) => {
  const adapter = cache(impl)

  await t.step('createStore', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.createStore('foobar'))

      // @ts-ignore
      await assertRejects(() => adapter.createStore(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.createStore('foobar')).ok)

      const withBadOutput = cache({
        ...impl,
        createStore: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.createStore('foobar'))
    })
  })

  await t.step('destroyStore', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.destroyStore('foobar'))

      // @ts-ignore
      await assertRejects(() => adapter.destroyStore(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.destroyStore('foobar')).ok)

      const withBadOutput = cache({
        ...impl,
        destroyStore: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.destroyStore('foobar'))
    })
  })

  await t.step('createDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.createDoc({
          store: 'foo',
          key: 'hello',
          value: { beep: 'world' },
          ttl: '2m',
        }),
      )

      await assertRejects(() =>
        adapter.createDoc({
          // @ts-ignore
          store: 123,
          key: 'hello',
          value: { beep: 'world' },
          ttl: '2m',
        })
      )

      await assertRejects(() =>
        adapter.createDoc({
          store: 'foo',
          // @ts-ignore
          key: 123,
          value: { beep: 'world' },
          ttl: '2m',
        })
      )

      await assertRejects(() =>
        adapter.createDoc({
          store: 'foo',
          key: 'hello',
          // @ts-ignore
          value: 'wrong',
          ttl: '2m',
        })
      )

      await assertRejects(() =>
        adapter.createDoc({
          store: 'foo',
          key: 'hello',
          value: { hello: 'world' },
          // @ts-ignore
          ttl: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.createDoc({
            store: 'foo',
            key: 'hello',
            value: { beep: 'world' },
            ttl: '2m',
          })
        ).ok,
      )

      const withBadOutput = cache({
        ...impl,
        createDoc: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.createDoc({
          store: 'foo',
          key: 'hello',
          value: { beep: 'world' },
          ttl: '2m',
        })
      )
    })
  })

  await t.step('getDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.getDoc({ store: 'foo', key: 'hello' }))

      // @ts-ignore
      await assertRejects(() => adapter.getDoc({ store: 123, key: 'hello' }))
      // @ts-ignore
      await assertRejects(() => adapter.getDoc({ store: 'foo', key: 123 }))
    })

    await t.step('should validate the outputs', async () => {
      assert(await adapter.getDoc({ store: 'foo', key: 'hello' }))

      const withBadOutput = cache({
        ...impl,
        getDoc: () => Promise.resolve(123),
      })
      await assertRejects(() =>
        withBadOutput.getDoc({
          store: 'foo',
          key: 'hello',
        })
      )
    })
  })

  await t.step('updateDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.updateDoc({
          store: 'foo',
          key: 'hello',
          value: { beep: 'world' },
          ttl: '2m',
        }),
      )

      await assertRejects(() =>
        adapter.updateDoc({
          // @ts-ignore
          store: 123,
          key: 'hello',
          value: { beep: 'world' },
          ttl: '2m',
        })
      )

      await assertRejects(() =>
        adapter.updateDoc({
          store: 'foo',
          // @ts-ignore
          key: 123,
          value: { beep: 'world' },
          ttl: '2m',
        })
      )

      await assertRejects(() =>
        adapter.updateDoc({
          store: 'foo',
          key: 'hello',
          // @ts-ignore
          value: 'wrong',
          ttl: '2m',
        })
      )

      await assertRejects(() =>
        adapter.updateDoc({
          store: 'foo',
          key: 'hello',
          value: { hello: 'world' },
          // @ts-ignore
          ttl: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.updateDoc({
            store: 'foo',
            key: 'hello',
            value: { beep: 'world' },
            ttl: '2m',
          })
        ).ok,
      )

      const withBadOutput = cache({
        ...impl,
        updateDoc: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.updateDoc({
          store: 'foo',
          key: 'hello',
          value: { beep: 'world' },
          ttl: '2m',
        })
      )
    })
  })

  await t.step('deleteDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.deleteDoc({ store: 'foo', key: 'hello' }))

      await assertRejects(() =>
        // @ts-ignore
        adapter.deleteDoc({ store: 123, key: 'hello' })
      )
      // @ts-ignore
      await assertRejects(() => adapter.deleteDoc({ store: 'foo', key: 123 }))
    })

    await t.step('should validate the outputs', async () => {
      assert(await adapter.deleteDoc({ store: 'foo', key: 'hello' }))

      const withBadOutput = cache({
        ...impl,
        deleteDoc: () => Promise.resolve(123),
      })
      await assertRejects(() =>
        withBadOutput.deleteDoc({
          store: 'foo',
          key: 'hello',
        })
      )
    })
  })

  await t.step('listDocs', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.listDocs({ store: 'foo', pattern: 'bar' }))

      await assertRejects(() =>
        adapter.listDocs({
          // @ts-ignore
          store: 123,
          pattern: 'hello',
        })
      )

      await assertRejects(() =>
        adapter.listDocs({
          store: 'foo',
          // @ts-ignore
          pattern: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      // @ts-ignore
      assert((await adapter.listDocs({ store: 'foo', pattern: 'bar' })).docs)

      const withBadOutput = cache({
        ...impl,
        listDocs: () => Promise.resolve({ ok: true, docs: [123] }),
      })
      await assertRejects(() =>
        withBadOutput.listDocs({
          store: 'foo',
          pattern: 'hello',
        })
      )
    })
  })
})
