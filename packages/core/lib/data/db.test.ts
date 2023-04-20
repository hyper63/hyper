// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { assert, assertEquals } from '../../dev_deps.ts'

import * as db from './db.ts'

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
  indexDocuments({ db, name, fields }: any) {
    return Promise.resolve({ ok: true, db, name, fields })
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
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('data - db', async (t) => {
  await t.step('create', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await db
        .create('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step('should check that the name is valid', async () => {
      await db
        .create('valid_name')
        .map(() => assert(true))
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('remove', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await db
        .remove('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step('should check that the name is valid', async () => {
      await db
        .remove('valid_name')
        .map(() => assert(true))
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('query', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await db
        .query('foobar', { _id: '123' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.query, { _id: '123' })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('index', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await db
        .index('foobar', 'fizz', ['type'])
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.name, 'fizz')
          // @ts-expect-error
          assertEquals(res.fields, ['type'])
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('list', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await db
        .list('foobar', {
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
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step('should default descending to false', async () => {
      await db
        .list('foobar', {
          keys: '123,456',
          startkey: '123',
          endkey: '456',
          limit: 123,
        })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.descending, false)
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('bulk', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await db
        .bulk('foobar', [{ _id: '123' }, { _id: '456' }])
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.docs, [{ _id: '123' }, { _id: '456' }])
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })
})
