/* eslint-disable @typescript-eslint/no-unused-vars */

const test = require('tape')
const store = require('./store.js')

const mockService = {
  createStore: (name) =>
    Promise.resolve({
      ok: true
    }),
  destroyStore: (name) => Promise.resolve({ ok: true }),
  listDocs: (name) => Promise.resolve({ ok: true })
}

const events = {
  dispatch: () => null
}

test('create cache store', (t) => {
  t.plan(1)

  function handleError () {
    t.ok(false)
  }
  function handleSuccess () {
    t.ok(true)
  }

  store.create('hello').runWith({ svc: mockService, events }).fork(handleError, handleSuccess)
})

test('should not create store', t => {
  t.plan(1)

  store.create('_foo').runWith({ svc: mockService, events })
    .fork(
      () => t.ok(true),
      () => t.ok(false)
    )
})

test('destroy cache store', (t) => {
  t.plan(1)

  function handleError () {
    t.ok(false)
  }
  function handleSuccess () {
    t.ok(true)
  }

  store.del('hello').runWith({ svc: mockService, events }).fork(handleError, handleSuccess)
})

test('query cache store', (t) => {
  t.plan(1)

  function handleError () {
    t.ok(false)
  }
  function handleSuccess () {
    t.ok(true)
  }

  store.query('hello').runWith({ svc: mockService, events }).fork(handleError, handleSuccess)
})
