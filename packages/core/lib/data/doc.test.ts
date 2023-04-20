// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assert, assertEquals } from '../../dev_deps.ts'

import * as doc from './doc.ts'

const mockService = {
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

Deno.test('data - doc', async (t) => {
  await t.step('create', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .create('foobar', { _id: '123' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123' })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step('should generate an id if not provided', async () => {
      await doc
        .create('foobar', { type: 'movie' })
        .map((res) => {
          // @ts-expect-error
          assert(res.id)
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('get', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .get('foobar', '123')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
        })
        .runWith({
          svc: mockService,
          events: mockEvents,
          isLegacyGetEnabled: true,
        })
        .toPromise()
    })

    await t.step(
      'should NOT return a hyper response shape if isLegacyGetEnabled',
      async () => {
        await doc
          .get('foobar', '123')
          .map((res) => {
            // @ts-expect-error
            assertEquals(res.db, 'foobar')
            // @ts-expect-error
            assertEquals(res.id, '123')
          })
          .runWith({
            svc: mockService,
            events: mockEvents,
            isLegacyGetEnabled: true,
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper error shape if isLegacyGetEnabled',
      async () => {
        await doc
          .get('foobar', 'err')
          .map((res) => {
            assert(res.ok === false)
          })
          .runWith({
            svc: {
              ...mockService,
              retrieveDocument() {
                // HyperErr shape
                return Promise.resolve({ ok: false, msg: 'oops' })
              },
            },
            events: mockEvents,
            isLegacyGetEnabled: true,
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper response shape if NOT isLegacyGetEnabled',
      async () => {
        await doc
          .get('foo', 'key')
          .map((res) => {
            assert(res.ok)
            // @ts-expect-error
            assert(res.doc.db)
            // @ts-expect-error
            assert(res.doc.id)
          })
          .runWith({
            svc: mockService,
            events: mockEvents,
            isLegacyGetEnabled: false,
          })
          .toPromise()
      },
    )

    await t.step(
      'should return a hyper error shape if NOT isLegacyGetEnabled',
      async () => {
        await doc
          .get('foobar', 'err')
          .map((res) => {
            assert(res.ok === false)
          })
          .runWith({
            svc: {
              ...mockService,
              retrieveDocument() {
                // NOT legacyGet response
                return Promise.resolve({ ok: false, msg: 'oops' })
              },
            },
            events: mockEvents,
            isLegacyGetEnabled: false,
          })
          .toPromise()
      },
    )
  })

  await t.step('update', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .update('foobar', '123', { _id: '123' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
          // @ts-expect-error
          assertEquals(res.doc, { _id: '123' })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('remove', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .remove('foobar', '123')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.db, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '123')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })
})
