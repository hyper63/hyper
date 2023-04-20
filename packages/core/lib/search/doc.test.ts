// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { assertEquals } from '../../dev_deps.ts'

import * as doc from './doc.ts'

const mockService = {
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

Deno.test('search - doc', async (t) => {
  await t.step('indexDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .indexDoc('foobar', '123', { _id: '123', name: 'foo' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123', name: 'foo' })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('getDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .getDoc('foobar', '123')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('updateDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .updateDoc('foobar', '123', { _id: '123', name: 'foo' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123', name: 'foo' })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('removeDoc', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .removeDoc('foobar', '123')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.index, 'foobar')
          // @ts-expect-error
          assertEquals(res.key, '123')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })
})
