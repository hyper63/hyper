// deno-lint-ignore-file no-unused-vars
import { assert, assertEquals } from '../../dev_deps.js'

import * as doc from './doc.js'

const test = Deno.test

const mockService = {
  createDoc: ({ store, key, doc, ttl }) => Promise.resolve({ ok: true }),
  getDoc: ({ store, key }) => Promise.resolve({ hello: 'world' }),
  updateDoc: ({ store, key, doc }) => Promise.resolve({ ok: true }),
  deleteDoc: ({ store, key }) => Promise.resolve({ ok: true }),
}

const fork = (m) => () => {
  m.fork(
    (e) => {
      assertEquals(false, true)
    },
    () => assertEquals(true, true),
  )
}

const events = {
  dispatch: () => null,
}

test(
  'create cache doc',
  fork(
    doc.create('store', 'key', { hello: 'world' }, '20s').runWith({
      svc: mockService,
      events,
    }),
  ),
)

test(
  'cannot create cache doc with invalid key',
  () => {
    doc.create('store', 'Not_Valid', { beep: 'boop' })
      .runWith({ svc: mockService, events })
      .fork(
        () => assertEquals(true, true),
        () => assertEquals(false, true),
      )
  },
)

test(
  'get cache doc',
  fork(doc.get('store', 'key-1234').runWith({ svc: mockService, events })),
)

test('get cache doc - legacyGet', async (t) => {
  await t.step('enabled', async (t) => {
    await t.step(
      'should passthrough a legacyGet response',
      fork(
        doc.get('foo', 'key').map((res) => {
          assert(res.hello)
        }).runWith({ svc: mockService, events, isLegacyGetEnabled: true }),
      ),
    )

    await t.step(
      'should passthrough a hyper error shape',
      fork(
        doc.get('foo', 'err')
          .map((res) => {
            assert(!res.ok)
          }).runWith({
            svc: {
              ...mockService,
              getDoc({ store, key }) {
                // NOT legacyGet response
                return Promise.resolve({ ok: false, msg: 'oops' })
              },
            },
            events,
            isLegacyGetEnabled: true,
          }),
      ),
    )
  })

  await t.step('disabled', async (t) => {
    await t.step(
      'should map to get response for forwards compatibility',
      fork(
        doc.get('foo', 'key').map((res) => {
          assert(res.ok)
          assert(res.doc.hello)
        }).runWith({ svc: mockService, events, isLegacyGetEnabled: false }),
      ),
    )

    await t.step(
      'should passthrough a hyper error shape',
      fork(
        doc.get('foo', 'err')
          .map((res) => {
            assert(!res.ok)
          }).runWith({
            svc: {
              ...mockService,
              getDoc({ store, key }) {
                // NOT legacyGet response
                return Promise.resolve({ ok: false, msg: 'oops' })
              },
            },
            events,
            isLegacyGetEnabled: false,
          }),
      ),
    )
  })
})

test(
  'update cache document',
  fork(
    doc.update('store', 'key-1234', { foo: 'bar' }).runWith({
      svc: mockService,
      events,
    }),
  ),
)

test(
  'delete cache document',
  fork(doc.del('store', 'key-1234').runWith({ svc: mockService, events })),
)
