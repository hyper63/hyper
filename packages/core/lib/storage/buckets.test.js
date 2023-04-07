// deno-lint-ignore-file no-unused-vars
import { assertEquals } from '../../dev_deps.ts'

import * as buckets from './buckets.js'

const test = Deno.test

const mock = {
  makeBucket(name) {
    return Promise.resolve({ ok: true })
  },
  removeBucket(name) {
    return Promise.resolve({ ok: true })
  },
  listBuckets() {
    return Promise.resolve({ ok: true, buckets: ['one', 'two', 'three'] })
  },
}

const fork = (m) => () => {
  m.fork(
    () => assertEquals(false, true),
    () => assertEquals(true, true),
  )
}

const events = {
  dispatch: () => null,
}

test('make bucket', fork(buckets.make('beep').runWith({ svc: mock, events })))
test(
  'remove bucket',
  fork(buckets.remove('beep').runWith({ svc: mock, events })),
)
test('list buckets', fork(buckets.list().runWith({ svc: mock, events })))
