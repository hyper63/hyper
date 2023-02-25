// deno-lint-ignore-file no-unused-vars ban-ts-comment
import { assert, assertRejects } from './dev_deps.ts'

import { search, type SearchPort } from './mod.ts'

const impl: SearchPort = {
  createIndex: ({ index, mappings }) => Promise.resolve({ ok: true }),
  deleteIndex: (index) => Promise.resolve({ ok: true }),
  indexDoc: ({ index, key, doc }) => Promise.resolve({ ok: true }),
  getDoc: ({ index, key }) => Promise.resolve({ ok: true, key, doc: { hello: 'world' } }),
  updateDoc: ({ index, key, doc }) => Promise.resolve({ ok: true }),
  removeDoc: ({ index, key }) => Promise.resolve({ ok: true }),
  bulk: ({ index, docs }) => Promise.resolve({ ok: true, results: [{ ok: true, id: '1' }] }),
  query: ({ index, q }) => Promise.resolve({ ok: true, matches: [{ hello: 'world' }] }),
}

Deno.test('search', async (t) => {
  const adapter = search(impl)

  await t.step('createIndex', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.createIndex({
          index: 'foobar',
          mappings: {
            fields: ['name'],
            storeFields: ['birthday'],
          },
        }),
      )

      await assertRejects(() =>
        adapter.createIndex({
          // @ts-ignore
          index: 123,
          mappings: {
            // @ts-ignore
            fields: [123],
          },
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.createIndex({
            index: 'foobar',
            mappings: {
              fields: ['name'],
              storeFields: ['birthday'],
            },
          })
        ).ok,
      )

      const withBadOutput = search({
        ...impl,
        createIndex: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.createIndex({
          index: 'foobar',
          mappings: {
            fields: ['name'],
            storeFields: ['birthday'],
          },
        })
      )
    })
  })

  await t.step('deleteIndex', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.deleteIndex('foobar'))
      // @ts-ignore
      await assertRejects(() => adapter.deleteIndex(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.deleteIndex('foobar')).ok)

      const withBadOutput = search({
        ...impl,
        deleteIndex: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.deleteIndex('foobar'))
    })
  })

  await t.step('indexDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.indexDoc({
          index: 'foobar',
          key: 'id',
          doc: { _id: 'foo', fizz: 'buzz' },
        }),
      )

      await assertRejects(() =>
        adapter.indexDoc({
          // @ts-ignore
          index: 123,
          key: 'id',
          doc: { _id: 'foo', fizz: 'buzz' },
        })
      )
      await assertRejects(() =>
        adapter.indexDoc({
          index: 'foobar',
          // @ts-ignore
          key: 123,
          doc: { _id: 'foo', fizz: 'buzz' },
        })
      )
      await assertRejects(() =>
        // @ts-ignore
        adapter.indexDoc({ index: 'foobar', key: 'id', doc: 123 })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.indexDoc({
            index: 'foobar',
            key: 'id',
            doc: { _id: 'foo', fizz: 'buzz' },
          })
        ).ok,
      )

      const withBadOutput = search({
        ...impl,
        indexDoc: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.indexDoc({
          index: 'foobar',
          key: 'id',
          doc: { _id: 'foo', fizz: 'buzz' },
        })
      )
    })
  })

  await t.step('updateDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.updateDoc({
          index: 'foobar',
          key: 'id',
          doc: { _id: 'foo', fizz: 'buzz' },
        }),
      )

      await assertRejects(() =>
        adapter.updateDoc({
          // @ts-ignore
          index: 123,
          key: 'id',
          doc: { _id: 'foo', fizz: 'buzz' },
        })
      )
      await assertRejects(() =>
        adapter.updateDoc({
          index: 'foobar',
          // @ts-ignore
          key: 123,
          doc: { _id: 'foo', fizz: 'buzz' },
        })
      )
      await assertRejects(() =>
        // @ts-ignore
        adapter.updateDoc({ index: 'foobar', key: 'id', doc: 123 })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.updateDoc({
            index: 'foobar',
            key: 'id',
            doc: { _id: 'foo', fizz: 'buzz' },
          })
        ).ok,
      )

      const withBadOutput = search({
        ...impl,
        updateDoc: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.updateDoc({
          index: 'foobar',
          key: 'id',
          doc: { _id: 'foo', fizz: 'buzz' },
        })
      )
    })
  })

  await t.step('getDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.getDoc({
          index: 'foobar',
          key: 'id',
        }),
      )

      await assertRejects(() =>
        adapter.getDoc({
          // @ts-ignore
          index: 123,
          key: 'id',
        })
      )
      await assertRejects(() =>
        adapter.getDoc({
          index: 'foobar',
          // @ts-ignore
          key: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.getDoc({
            index: 'foobar',
            key: 'id',
          })
        ).ok,
      )

      const withBadOutputKey = search({
        ...impl,
        getDoc: () => Promise.resolve({ ok: true, key: 123, doc: { hello: 'world' } }),
      })
      await assertRejects(() =>
        withBadOutputKey.getDoc({
          index: 'foobar',
          key: 'id',
        })
      )

      const withBadOutputDoc = search({
        ...impl,
        getDoc: () => Promise.resolve({ ok: true, key: 'foo', doc: 123 }),
      })
      await assertRejects(() =>
        withBadOutputDoc.getDoc({
          index: 'foobar',
          key: 'id',
        })
      )
    })
  })

  await t.step('removeDoc', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.removeDoc({
          index: 'foobar',
          key: 'id',
        }),
      )

      await assertRejects(() =>
        adapter.removeDoc({
          // @ts-ignore
          index: 123,
          key: 'id',
        })
      )
      await assertRejects(() =>
        adapter.removeDoc({
          index: 'foobar',
          // @ts-ignore
          key: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.removeDoc({
            index: 'foobar',
            key: 'id',
          })
        ).ok,
      )

      const withBadOutput = search({
        ...impl,
        removeDoc: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.removeDoc({
          index: 'foobar',
          key: 'id',
        })
      )
    })
  })

  await t.step('bulk', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.bulk({
          index: 'foobar',
          docs: [{ _id: 'foo', fizz: 'buzz' }],
        }),
      )

      await assertRejects(() =>
        adapter.bulk({
          // @ts-ignore
          index: 1234,
          docs: [{ _id: 'foo', fizz: 'buzz' }],
        })
      )

      await assertRejects(() =>
        adapter.bulk({
          index: 'foobar',
          // @ts-ignore
          docs: [123],
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      const res = await adapter.bulk({
        index: 'foobar',
        docs: [{ _id: 'foo', fizz: 'buzz' }],
      })
      // @ts-ignore
      assert(res.results)

      const withBadOutput = search({
        ...impl,
        bulk: () => Promise.resolve({ ok: true, results: [123] }),
      })
      await assertRejects(() =>
        withBadOutput.bulk({
          index: 'foobar',
          docs: [{ _id: 'foo', fizz: 'buzz' }],
        })
      )
    })
  })

  await t.step('query', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.query({ index: 'fooo', q: { query: 'bar' } }))
      await assertRejects(() =>
        // @ts-ignore
        adapter.query({ index: 1234, q: { query: 'bar' } })
      )
      await assertRejects(() =>
        // @ts-ignore
        adapter.query({ index: 'foobar', q: { query: 123 } })
      )
      await assertRejects(() =>
        // @ts-ignore
        adapter.query({ index: 'foobar', q: { query: 'bar', fields: [123] } })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        // @ts-ignore
        (await adapter.query({ index: 'fooo', q: { query: 'bar' } })).matches,
      )

      const withBadOutput = search({
        ...impl,
        query: () => Promise.resolve({ ok: true, matches: [123] }),
      })
      await assertRejects(() => withBadOutput.query({ index: 'fooo', q: { query: 'bar' } }))
    })
  })
})
