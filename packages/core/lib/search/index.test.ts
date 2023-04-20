// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { assertEquals } from '../../dev_deps.ts'

import * as index from './index.ts'

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
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('search - index', async (t) => {
  await t.step('createIndex', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await index
        .createIndex('foobar', { fields: ['name'] })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.mappings, { fields: ['name'] })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('deleteIndex', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await index
        .deleteIndex('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('bulk', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await index
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
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('query', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await index
        .query('foobar', { query: 'movie' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.q, { query: 'movie' })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })
})
