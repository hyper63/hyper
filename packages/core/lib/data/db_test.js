const test = require('tape')
const db = require('./db.js')

const mockDb = {
  createDatabase (name) {
    return Promise.resolve({ ok: true })
  },
  removeDatabase (name) {
    return Promise.resolve({ ok: true })
  },
  bulkDocuments ({ db, docs }) {
    if (docs.length === 2) {
      return Promise.resolve({
        ok: true,
        results: [{ ok: true, id: '1' }, { ok: true, id: '2' }]
      })
    } else {
      return Promise.reject({ ok: false })
    }
  }
}

const fork = (m) => (t) => {
  t.plan(1)
  return m.fork(
    () => t.ok(false),
    () => t.ok(true)
  )
}
const handleFail = (m) => (t) => {
  t.plan(1)
  return m.fork(
    () => t.ok(true),
    () => t.ok(false)
  )
}

const events = {
  dispatch: () => null
}

test('create database', fork(db.create('foo').runWith({ svc: mockDb, events })))
test('remove database', fork(db.remove('foo').runWith({ svc: mockDb, events })))
test('bulk documents', fork(db.bulk('foo', [{ id: '1' }, { id: '2' }]).runWith({ svc: mockDb, events })))
test('bulk docs failure', handleFail(db.bulk('foo', []).runWith({ svc: mockDb, events })))
// test("query database");
// test("index database");
