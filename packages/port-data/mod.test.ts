// deno-lint-ignore-file no-unused-vars ban-ts-comment
import { assert, assertRejects } from './dev_deps.ts'

import { data, type DataPort } from './mod.ts'

const impl: DataPort = {
  createDatabase: (name) => Promise.resolve({ ok: true }),
  removeDatabase: (name) => Promise.resolve({ ok: true }),
  createDocument: ({ db, id, doc }) => Promise.resolve({ ok: true, id }),
  retrieveDocument: ({ db, id }) => Promise.resolve({ hello: 'world' }),
  updateDocument: ({ db, id, doc }) => Promise.resolve({ ok: true, id }),
  removeDocument: ({ db, id }) => Promise.resolve({ ok: true, id }),
  listDocuments: ({ db, limit, startkey, endkey, keys, descending }) =>
    Promise.resolve({ ok: true, docs: [] }),
  queryDocuments: ({ db, query }) => (
    console.log(query), Promise.resolve({ ok: true, docs: [] })
  ),
  indexDocuments: ({ db, name, fields }) => Promise.resolve({ ok: true }),
  bulkDocuments: ({ db, docs }) => Promise.resolve({ ok: true, results: [{ ok: true, id: '1' }] }),
}

Deno.test('data', async (t) => {
  const adapter = data(impl)

  await t.step('createDatabase', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.createDatabase('foo'))

      // @ts-ignore
      await assertRejects(() => adapter.createDatabase(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.createDatabase('foobar')).ok)

      const withBadOutput = data({
        ...impl,
        createDatabase: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.createDatabase('foobar'))
    })
  })

  await t.step('removeDatabase', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.removeDatabase('foo'))

      // @ts-ignore
      await assertRejects(() => adapter.removeDatabase(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.removeDatabase('foobar')).ok)

      const withBadOutput = data({
        ...impl,
        removeDatabase: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.removeDatabase('foobar'))
    })
  })

  await t.step('createDocument', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.createDocument({
          db: 'foo',
          id: '123',
          doc: { _id: '123', hello: 'world' },
        }),
      )

      await assertRejects(() =>
        adapter.createDocument({
          // @ts-ignore
          db: 123,
          id: '123',
          doc: { _id: '123', hello: 'world' },
        })
      )
      await assertRejects(() =>
        adapter.createDocument({
          db: 'foo',
          // @ts-ignore
          id: 123,
          doc: { _id: '123', hello: 'world' },
        })
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.createDocument({ db: 'foo', id: '123', doc: 123 })
      )
    })

    await t.step('should validate the outputs', async () => {
      const res = await adapter.createDocument({
        db: 'foo',
        id: '123',
        doc: { _id: '123', hello: 'world' },
      })
      // @ts-ignore
      assert(res.id)

      const withBadOutput = data({
        ...impl,
        createDocument: () => Promise.resolve({ ok: true, id: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.createDocument({
          db: 'foo',
          id: '123',
          doc: { _id: '123', hello: 'world' },
        })
      )
    })
  })

  await t.step('retrieveDocument', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.retrieveDocument({ db: 'foo', id: '123' }))

      await assertRejects(() =>
        // @ts-ignore
        adapter.retrieveDocument({ db: 123, id: '123' })
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.retrieveDocument({ db: 'foo', id: 123 })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(await adapter.retrieveDocument({ db: 'foo', id: '123' }))

      const withBadOutput = data({
        ...impl,
        retrieveDocument: () => Promise.resolve(123),
      })
      await assertRejects(() =>
        withBadOutput.retrieveDocument({
          db: 'foo',
          id: '123',
        })
      )
    })
  })

  await t.step('updateDocument', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.updateDocument({
          db: 'foo',
          id: '123',
          doc: { _id: '123', hello: 'world' },
        }),
      )

      await assertRejects(() =>
        adapter.updateDocument({
          // @ts-ignore
          db: 123,
          id: '123',
          doc: { _id: '123', hello: 'world' },
        })
      )
      await assertRejects(() =>
        adapter.updateDocument({
          db: 'foo',
          // @ts-ignore
          id: 123,
          doc: { _id: '123', hello: 'world' },
        })
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.updateDocument({ db: 'foo', id: '123', doc: 123 })
      )
    })

    await t.step('should validate the outputs', async () => {
      const res = await adapter.updateDocument({
        db: 'foo',
        id: '123',
        doc: { _id: '123', hello: 'world' },
      })
      // @ts-ignore
      assert(res.id)

      const withBadOutput = data({
        ...impl,
        updateDocument: () => Promise.resolve({ ok: true, id: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.updateDocument({
          db: 'foo',
          id: '123',
          doc: { _id: '123', hello: 'world' },
        })
      )
    })
  })

  await t.step('removeDocument', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.removeDocument({ db: 'foo', id: '123' }))

      await assertRejects(() =>
        // @ts-ignore
        adapter.removeDocument({ db: 123, id: '123' })
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.removeDocument({ db: 'foo', id: 123 })
      )
    })

    await t.step('should validate the outputs', async () => {
      const res = await adapter.removeDocument({
        db: 'foo',
        id: '123',
      })
      // @ts-ignore
      assert(res.id)

      const withBadOutput = data({
        ...impl,
        removeDocument: () => Promise.resolve({ ok: true, id: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.removeDocument({
          db: 'foo',
          id: '123',
        })
      )
    })
  })

  await t.step('listDocuments', async (t) => {
    await t.step('should validate the inputs', async (t) => {
      assert(
        await adapter.listDocuments({
          db: '123',
          limit: 1000,
          startkey: '123',
          endkey: '456',
          keys: '123,456',
          descending: false,
        }),
      )

      await assertRejects(() =>
        adapter.listDocuments({
          // @ts-ignore
          db: 123,
          limit: 1000,
          startkey: '123',
          endkey: '456',
          keys: '123,456',
          descending: false,
        })
      )

      await t.step('limit', async (t) => {
        await t.step('should parse to a number, if provided', async () => {
          assert(
            await adapter.listDocuments({
              db: '123',
              limit: 1000,
              startkey: '123',
              endkey: '456',
              keys: '123,456',
              descending: false,
            }),
          )

          assert(
            await adapter.listDocuments({
              db: '123',
              limit: '456',
              startkey: '123',
              endkey: '456',
              keys: '123,456',
              descending: false,
            }),
          )

          assert(
            await adapter.listDocuments({
              db: '123',
              limit: ' 456 ',
              startkey: '123',
              endkey: '456',
              keys: '123,456',
              descending: false,
            }),
          )

          assert(
            await adapter.listDocuments({
              db: '123',
              limit: undefined,
              startkey: '123',
              endkey: '456',
              keys: '123,456',
              descending: false,
            }),
          )
        })

        await t.step('should reject the unparseable value', async () => {
          await assertRejects(() =>
            adapter.listDocuments({
              db: 'foo',
              // @ts-ignore
              limit: 'not parseable',
              startkey: '123',
              endkey: '456',
              keys: '123,456',
              descending: false,
            })
          )

          await assertRejects(() =>
            adapter.listDocuments({
              db: 'foo',
              // @ts-ignore
              limit: [],
              startkey: '123',
              endkey: '456',
              keys: '123,456',
              descending: false,
            })
          )
        })
      })

      await assertRejects(() =>
        adapter.listDocuments({
          db: 'foo',
          limit: 1000,
          // @ts-ignore
          startkey: 123,
          endkey: '456',
          keys: '123,456',
          descending: false,
        })
      )

      await assertRejects(() =>
        adapter.listDocuments({
          db: 'foo',
          limit: 1000,
          startkey: '123',
          // @ts-ignore
          endkey: 123,
          keys: '123,456',
          descending: false,
        })
      )

      await assertRejects(() =>
        adapter.listDocuments({
          db: 'foo',
          limit: 1000,
          startkey: '123',
          endkey: '456',
          // @ts-ignore
          keys: 123,
          descending: false,
        })
      )

      await assertRejects(() =>
        adapter.listDocuments({
          db: 'foo',
          limit: 1000,
          startkey: '123',
          endkey: '456',
          keys: '123,456',
          // @ts-ignore
          descending: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      const res = await adapter.listDocuments({ db: 'foo' })
      // @ts-ignore
      assert(res.docs)

      const withBadOutput = data({
        ...impl,
        listDocuments: () => Promise.resolve({ ok: true, docs: [123] }),
      })
      await assertRejects(() => withBadOutput.listDocuments({ db: 'foo' }))
    })
  })

  await t.step('queryDocuments', async (t) => {
    await t.step('should validate the inputs', async (t) => {
      assert(
        await adapter.queryDocuments({
          db: 'foo',
          query: {
            selector: { name: { $gt: 'mike' } },
            fields: ['name'],
            sort: ['ASC' as const],
            limit: 1000,
            use_index: 'idx-name',
          },
        }),
      )

      assert(
        await adapter.queryDocuments({
          db: 'foo',
          query: {
            selector: { name: { $gt: 'mike' } },
          },
        }),
      )

      await assertRejects(() =>
        adapter.queryDocuments({
          // @ts-ignore
          db: 123,
          query: {
            selector: { name: { $gt: 'mike' } },
            fields: ['name'],
            sort: ['ASC' as const],
            limit: 1000,
            use_index: 'idx-name',
          },
        })
      )

      await assertRejects(() =>
        adapter.queryDocuments({
          db: '123',
          query: {
            // @ts-ignore
            selector: 123,
            fields: ['name'],
            sort: ['ASC' as const],
            limit: 1000,
            use_index: 'idx-name',
          },
        })
      )

      await assertRejects(() =>
        adapter.queryDocuments({
          db: '123',
          query: {
            selector: { name: { $gt: 'mike' } },
            // @ts-ignore
            fields: [123],
            sort: ['ASC' as const],
            limit: 1000,
            use_index: 'idx-name',
          },
        })
      )

      await assertRejects(() =>
        adapter.queryDocuments({
          db: '123',
          query: {
            selector: { name: { $gt: 'mike' } },
            fields: ['name'],
            // @ts-ignore
            sort: ['FOO' as const],
            limit: 1000,
            use_index: 'idx-name',
          },
        })
      )

      await t.step('limit', async (t) => {
        await t.step('should parse to a number, if provided', async () => {
          assert(
            await adapter.queryDocuments({
              db: 'foo',
              query: {
                selector: { name: { $gt: 'mike' } },
                fields: ['name'],
                sort: ['ASC' as const],
                limit: 1000,
                use_index: 'idx-name',
              },
            }),
          )

          assert(
            await adapter.queryDocuments({
              db: 'foo',
              query: {
                selector: { name: { $gt: 'mike' } },
                fields: ['name'],
                sort: ['ASC' as const],
                limit: '1000',
                use_index: 'idx-name',
              },
            }),
          )

          assert(
            await adapter.queryDocuments({
              db: 'foo',
              query: {
                selector: { name: { $gt: 'mike' } },
                fields: ['name'],
                sort: ['ASC' as const],
                limit: ' 1000  ',
                use_index: 'idx-name',
              },
            }),
          )

          assert(
            await adapter.queryDocuments({
              db: 'foo',
              query: {
                selector: { name: { $gt: 'mike' } },
                fields: ['name'],
                sort: ['ASC' as const],
                limit: undefined,
                use_index: 'idx-name',
              },
            }),
          )
        })

        await t.step('should reject the unparseable value', async () => {
          await assertRejects(() =>
            adapter.queryDocuments({
              db: '123',
              query: {
                selector: { name: { $gt: 'mike' } },
                fields: ['name'],
                sort: ['ASC' as const],
                // @ts-ignore
                limit: 'wut',
                use_index: 'idx-name',
              },
            })
          )

          await assertRejects(() =>
            adapter.queryDocuments({
              db: '123',
              query: {
                selector: { name: { $gt: 'mike' } },
                fields: ['name'],
                sort: ['ASC' as const],
                // @ts-ignore
                limit: [],
                use_index: 'idx-name',
              },
            })
          )
        })
      })

      await assertRejects(() =>
        adapter.queryDocuments({
          db: '123',
          query: {
            selector: { name: { $gt: 'mike' } },
            fields: ['name'],
            sort: ['ASC' as const],
            limit: 1000,
            // @ts-ignore
            use_index: 123,
          },
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      const res = await adapter.queryDocuments({
        db: 'foo',
        query: {
          selector: { name: { $gt: 'mike' } },
          fields: ['name'],
          sort: ['ASC' as const],
          limit: 1000,
          use_index: 'idx-name',
        },
      })

      // @ts-ignore
      assert(res.docs)

      const withBadOutput = data({
        ...impl,
        queryDocuments: () => Promise.resolve({ ok: true, docs: [123] }),
      })
      await assertRejects(() =>
        withBadOutput.queryDocuments({
          db: 'foo',
          query: {
            selector: { name: { $gt: 'mike' } },
            fields: ['name'],
            sort: ['ASC' as const],
            limit: 1000,
            use_index: 'idx-name',
          },
        })
      )
    })
  })

  await t.step('indexDocuments', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.indexDocuments({
          db: 'foo',
          fields: ['name'],
          name: 'idx-name',
        }),
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.indexDocuments({ db: 123, fields: ['name'], name: 'idx-name' })
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.indexDocuments({ db: 'foo', fields: [123], name: 'idx-name' })
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.indexDocuments({ db: 'foo', fields: ['name'], name: 123 })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.indexDocuments({
            db: 'foo',
            fields: ['name'],
            name: 'idx-name',
          })
        ).ok,
      )

      const withBadOutput = data({
        ...impl,
        indexDocuments: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.indexDocuments({
          db: 'foo',
          fields: ['name'],
          name: 'idx-name',
        })
      )
    })
  })

  await t.step('bulkDocuments', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.bulkDocuments({
          db: 'foo',
          docs: [{ _id: '123', hello: 'world' }],
        }),
      )

      await assertRejects(() =>
        adapter.bulkDocuments({
          // @ts-ignore
          db: 123,
          docs: [{ _id: '123', hello: 'world' }],
        })
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.bulkDocuments({ db: 'foo', docs: [123] })
      )
    })

    await t.step('should validate the outputs', async () => {
      const res = await adapter.bulkDocuments({
        db: 'foo',
        docs: [{ _id: '123', hello: 'world' }],
      })
      //@ts-ignore
      assert(res.results)

      const withBadOutput = data({
        ...impl,
        bulkDocuments: () => Promise.resolve({ ok: true, results: [123] }),
      })
      await assertRejects(() =>
        withBadOutput.bulkDocuments({
          db: 'foo',
          docs: [{ _id: '123', hello: 'world' }],
        })
      )
    })
  })
})
