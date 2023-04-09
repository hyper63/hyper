// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assert, assertEquals, assertObjectMatch } from '../../dev_deps.ts'

import * as doc from './doc.ts'

const mockService = {
  createDoc: (arg: any) => Promise.resolve({ ok: true, ...arg }),
  getDoc: (arg: any) => Promise.resolve({ hello: 'world', ...arg }),
  updateDoc: (arg: any) => Promise.resolve({ ok: true, ...arg }),
  deleteDoc: (arg: any) => Promise.resolve({ ok: true, ...arg }),
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('cache - doc', async (t) => {
  await t.step('create', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .create('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          assertObjectMatch(res, {
            store: 'store',
            key: 'key',
            value: { hello: 'world' },
            ttl: '20000',
          })
          return res
        })
        .runWith({
          svc: mockService,
          events: mockEvents,
        })
        .toPromise()
    })

    await t.step('should convert the ttl, if provided', async () => {
      await doc
        .create('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          // @ts-ignore
          assertEquals(res.ttl, '20000')
          return res
        })
        .runWith({
          svc: mockService,
          events: mockEvents,
        })
        .toPromise()
    })

    await t.step('should remove the ttl, if not provided', async () => {
      await doc
        .create('store', 'key', { hello: 'world' })
        .map((res) => {
          assert(!Object.hasOwn(res, 'ttl'))
          return res
        })
        .runWith({
          svc: mockService,
          events: mockEvents,
        })
        .toPromise()
    })

    await t.step('should reject if cache doc has an invalid key', async () => {
      await doc
        .create('store', 'Not_Valid', { beep: 'boop' })
        .runWith({ svc: mockService, mockEvents })
        .toPromise()
        .then(() => assert(false))
        .catch(() => assert(true))
    })
  })

  await t.step('get', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .get('foo', 'key')
        .map((res) => {
          assertObjectMatch(res, {
            store: 'foo',
            key: 'key',
          })
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
          .get('foo', 'key')
          .map((res) => {
            // @ts-expect-error
            assert(res.hello)
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
          .get('foo', 'err')
          .map((res) => {
            // @ts-expect-error
            assert(!res.ok)
          })
          .runWith({
            svc: {
              ...mockService,
              getDoc() {
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
            // @ts-expect-error
            assert(res.ok)
            // @ts-expect-error
            assert(res.doc.hello)
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
      'should passthrough a hyper error shape if NOT isLegacyGetEnabled',
      async () => {
        await doc
          .get('foo', 'err')
          .map((res) => {
            // @ts-expect-error
            assert(!res.ok)
          })
          .runWith({
            svc: {
              ...mockService,
              getDoc() {
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
        .update('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          assertObjectMatch(res, {
            store: 'store',
            key: 'key',
            value: { hello: 'world' },
            ttl: '20000',
          })
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step('should convert the ttl, if provided', async () => {
      await doc
        .update('store', 'key', { hello: 'world' }, '20s')
        .map((res) => {
          // @ts-ignore
          assertEquals(res.ttl, '20000')
          return res
        })
        .runWith({
          svc: mockService,
          events: mockEvents,
        })
        .toPromise()
    })

    await t.step('should remove the ttl, if not provided', async () => {
      await doc
        .update('store', 'key', { hello: 'world' })
        .map((res) => {
          assert(!Object.hasOwn(res, 'ttl'))
          return res
        })
        .runWith({
          svc: mockService,
          events: mockEvents,
        })
        .toPromise()
    })

    await t.step('should reject if cache doc has an invalid key', async () => {
      await doc
        .update('store', 'Not_Valid', { beep: 'boop' })
        .runWith({ svc: mockService, mockEvents })
        .toPromise()
        .then(() => assert(false))
        .catch(() => assert(true))
    })
  })

  await t.step('del', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await doc
        .del('store', 'key')
        .map((res) => {
          assertObjectMatch(res, {
            store: 'store',
            key: 'key',
          })
        })
        .runWith({
          svc: mockService,
          events: mockEvents,
        })
        .toPromise()
    })

    await t.step('should reject if cache doc has an invalid key', async () => {
      await doc
        .del('store', 'Not_Valid')
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
        .then(() => assert(false))
        .catch(() => assert(true))
    })
  })
})
