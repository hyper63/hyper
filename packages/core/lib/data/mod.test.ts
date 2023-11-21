// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { assert, assertEquals } from '../../dev_deps.ts'

import builder from './mod.ts'

const mockService = {
  createDatabase(name: any) {
    return Promise.resolve({ ok: true, name })
  },
  removeDatabase(name: any) {
    return Promise.resolve({ ok: true, name })
  },
  queryDocuments({ db, query }: any) {
    return Promise.resolve({ ok: true, db, query })
  },
  indexDocuments({ db, name, fields, partialFilter }: any) {
    return Promise.resolve({ ok: true, db, name, fields, partialFilter })
  },
  listDocuments({ db, limit, startkey, endkey, keys, descending }: any) {
    return Promise.resolve({
      ok: true,
      db,
      limit,
      startkey,
      endkey,
      keys,
      descending,
    })
  },
  bulkDocuments({ db, docs }: any) {
    return Promise.resolve({ ok: true, db, docs })
  },
  createDocument({ db, id, doc }: any) {
    return Promise.resolve({ ok: true, db, id, doc })
  },
  retrieveDocument({ db, id }: any) {
    // legacy get response
    return Promise.resolve({ db, id })
  },
  updateDocument({ db, id, doc }: any) {
    return Promise.resolve({ ok: true, db, id, doc })
  },
  removeDocument({ db, id }: any) {
    return Promise.resolve({ ok: true, db, id })
  },
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('data', async (t) => {
  const data = builder({
    data: mockService,
    events: mockEvents,
  } as unknown as any)

  await t.step('createDatabase', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .createDatabase('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .toPromise()
    })

    await t.step('should check that the name is valid', async () => {
      await data
        .createDatabase('valid_name')
        .map(() => assert(true))
        .toPromise()
    })
  })

  await t.step('destroyDatabase', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .destroyDatabase('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .toPromise()
    })

    await t.step('should check that the name is valid', async () => {
      await data
        .destroyDatabase('valid_name')
        .map(() => assert(true))
        .toPromise()
    })
  })

  await t.step('query', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .query('foobar', { selector: { _id: '123' } })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.query, { selector: { _id: '123' } })
        })
        .toPromise()
    })
  })

  await t.step('index', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .index('foobar', 'fizz', ['type'], undefined)
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.name, 'fizz')
          // @ts-expect-error
          assertEquals(res.fields, ['type'])
          // @ts-expect-error
          assertEquals(res.partialFilter, undefined)
        })
        .toPromise()

      await data
        // @ts-expect-error
        .index('foobar', 'fizz', [{ type: 'ASC' }])
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.name, 'fizz')
          // @ts-expect-error
          assertEquals(res.fields, [{ type: 'ASC' }])
          // @ts-expect-error
          assertEquals(res.partialFilter, undefined)
        })
        .toPromise()

      await data
        .index('foobar', 'fizz', [{ type: 'ASC' }], { type: 'user' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.name, 'fizz')
          // @ts-expect-error
          assertEquals(res.fields, [{ type: 'ASC' }])
          // @ts-expect-error
          assertEquals(res.partialFilter, { type: 'user' })
        })
        .toPromise()
    })
  })

  await t.step('listDocuments', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .listDocuments('foobar', {
          keys: '123,456',
          startkey: '123',
          endkey: '456',
          limit: 123,
          descending: true,
        })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.keys, '123,456')
          // @ts-expect-error
          assertEquals(res.startkey, '123')
          // @ts-expect-error
          assertEquals(res.endkey, '456')
          // @ts-expect-error
          assertEquals(res.limit, 123)
          // @ts-expect-error
          assertEquals(res.descending, true)
        })
        .toPromise()
    })

    await t.step('should default descending to false', async () => {
      await data
        .listDocuments('foobar', {
          keys: '123,456',
          startkey: '123',
          endkey: '456',
          limit: 123,
        })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.descending, false)
        })
        .toPromise()
    })
  })

  await t.step('bulkDocuments', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .bulkDocuments('foobar', [{ _id: '123' }, { _id: '456' }])
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.docs, [{ _id: '123' }, { _id: '456' }])
        })
        .toPromise()
    })
  })

  await t.step('createDocument', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .createDocument('foobar', { _id: '123' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123' })
        })
        .toPromise()
    })

    await t.step('should generate an id if not provided', async () => {
      await data
        .createDocument('foobar', { type: 'movie' })
        .map((res) => {
          // @ts-expect-error
          assert(res.id)
        })
        .toPromise()
    })
  })

  await t.step('getDocument', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .getDocument('foobar', '123', true)
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
        })
        .toPromise()
    })

    await t.step(
      'should NOT return a hyper response shape if isLegacyGetEnabled',
      async () => {
        await data
          .getDocument('foobar', '123', true)
          .map((res) => {
            // @ts-expect-error
            assertEquals(res.db, 'foobar')
            // @ts-expect-error
            assertEquals(res.id, '123')
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper error shape if isLegacyGetEnabled',
      async () => {
        const dataWithErr = builder({
          data: {
            ...mockService,
            retrieveDocument() {
              // HyperErr shape
              return Promise.resolve({ ok: false, msg: 'oops' })
            },
          },
          events: mockEvents,
        } as unknown as any)

        await dataWithErr
          .getDocument('foobar', 'err', true)
          .map((res) => {
            // @ts-expect-error
            assert(res.ok === false)
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper response shape if NOT isLegacyGetEnabled',
      async () => {
        await data
          .getDocument('foo', 'key', false)
          .map((res) => {
            // @ts-expect-error
            assert(res.ok)
            // @ts-expect-error
            assert(res.doc.db)
            // @ts-expect-error
            assert(res.doc.id)
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper error shape if NOT isLegacyGetEnabled',
      async () => {
        const dataWithErr = builder({
          data: {
            ...mockService,
            retrieveDocument() {
              // NOT legacyGet response
              return Promise.resolve({ ok: false, msg: 'oops' })
            },
          },
          events: mockEvents,
        } as unknown as any)
        await dataWithErr
          .getDocument('foobar', 'err', false)
          .map((res) => {
            // @ts-expect-error
            assert(res.ok === false)
          })
          .toPromise()
      },
    )
  })

  await t.step('updateDocument', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .updateDocument('foobar', '123', { _id: '123' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123' })
        })
        .toPromise()
    })
  })

  await t.step('removeDocument', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await data
        .removeDocument('foobar', '123')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
        })
        .toPromise()
    })
  })
})
