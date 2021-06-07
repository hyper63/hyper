const test = require('tape')
const doc = require('./doc.js')

const mockService = {
  createDoc: ({ store, key, doc, ttl }) => Promise.resolve({ ok: true }),
  getDoc: ({ store, key }) => Promise.resolve({ hello: 'world' }),
  updateDoc: ({ store, key, doc }) => Promise.resolve({ ok: true }),
  deleteDoc: ({ store, key }) => Promise.resolve({ ok: true })
}

const fork = (m) => (t) => {
  t.plan(1)
  m.fork(
    e => {
      console.log(e)
      t.ok(false)
    },
    () => t.ok(true)
  )
}

const events = {
  dispatch: () => null
}

test(
  'create cache doc',
  fork(doc.create('store', 'key', { hello: 'world' }).runWith({ svc: mockService, events }))
)

test(
  'cannot create cache doc with invalid key',
  t => {
    t.plan(1)
    doc.create('store', 'Not_Valid', { beep: 'boop' })
      .runWith({ svc: mockService, events })
      .fork(
        e => t.ok(true),
        r => t.ok(false)
      )
  }
)

test('get cache doc', fork(doc.get('store', 'key-1234').runWith({ svc: mockService, events })))

test(
  'update cache document',
  fork(doc.update('store', 'key-1234', { foo: 'bar' }).runWith({ svc: mockService, events }))
)

test(
  'delete cache document',
  fork(doc.update('store', 'key-1234').runWith({ svc: mockService, events }))
)
