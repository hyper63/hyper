// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { assertEquals } from '../../dev_deps.ts'

import builder from './mod.ts'

const mockService = {
  createIndex({ index, mappings }: any) {
    return Promise.resolve({ ok: true, index, mappings })
  },
  deleteIndex(name: any) {
    return Promise.resolve({ ok: true, name })
  },
  bulk({ index, docs }: any) {
    return Promise.resolve({ ok: true, index, docs })
  },
  query({ index, q }: any) {
    return Promise.resolve({ ok: true, index, q })
  },
  indexDoc({ index, key, doc }: any) {
    return Promise.resolve({ ok: true, index, key, doc })
  },
  getDoc({ index, key }: any) {
    return Promise.resolve({ ok: true, index, key })
  },
  updateDoc({ index, key, doc }: any) {
    return Promise.resolve({ ok: true, index, key, doc })
  },
  removeDoc({ index, key }: any) {
    return Promise.resolve({ ok: true, index, key })
  },
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('search', async (t) => {
  const search = builder({
    search: mockService,
    events: mockEvents,
  } as unknown as any)

  await t.step('createIndex', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .createIndex('foobar', { fields: ['name'] })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.mappings, { fields: ['name'] })
        })
        .toPromise()
    })
  })

  await t.step('deleteIndex', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .deleteIndex('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .toPromise()
    })
  })

  await t.step('bulk', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .bulk('foobar', [
          { _id: '123', name: 'foo' },
          { _id: '456', name: 'bar' },
        ])
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.docs, [
            { _id: '123', name: 'foo' },
            { _id: '456', name: 'bar' },
          ])
        })
        .toPromise()
    })
  })

  await t.step('query', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .query('foobar', { query: 'movie' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.q, { query: 'movie' })
        })
        .toPromise()
    })
  })

  await t.step('indexDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .indexDoc('foobar', '123', { _id: '123', name: 'foo' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123', name: 'foo' })
        })
        .toPromise()
    })
  })

  await t.step('getDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .getDoc('foobar', '123')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
        })
        .toPromise()
    })
  })

  await t.step('updateDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .updateDoc('foobar', '123', { _id: '123', name: 'foo' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123', name: 'foo' })
        })
        .toPromise()
    })
  })

  await t.step('removeDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await search
        .removeDoc('foobar', '123')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
        })
        .toPromise()
    })
  })
})
