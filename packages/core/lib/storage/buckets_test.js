const test = require('tape')
const buckets = require('./buckets')

const mock = {
  makeBucket (name) {
    return Promise.resolve({ ok: true })
  },
  removeBucket (name) {
    return Promise.resolve({ ok: true })
  },
  listBuckets () {
    return Promise.resolve({ ok: true, buckets: ['one', 'two', 'three'] })
  }
}

const fork = (m) => (t) => {
  t.plan(1)
  m.fork(
    () => t.ok(false),
    () => t.ok(true)
  )
}

const events = {
  dispatch: () => null
}

test('make bucket', fork(buckets.make('beep').runWith({ svc: mock, events })))
test('remove bucket', fork(buckets.remove('beep').runWith({ svc: mock, events })))
test('list buckets', fork(buckets.list().runWith({ svc: mock, events })))
