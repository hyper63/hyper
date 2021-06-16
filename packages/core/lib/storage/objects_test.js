// deno-lint-ignore-file no-unused-vars
import { assertEquals } from '../../dev_deps.js'
import * as objects from './objects.js'
const test = Deno.test

const mock = {
  putObject ({ bucket, object, stream }) {
    return Promise.resolve({ ok: true })
  },
  getObject ({ bucket, object }) {
    return Promise.resolve({ ok: true })
  },
  removeObject ({ bucket, object }) {
    return Promise.resolve({ ok: true })
  },
  listObjects ({ bucket, prefix }) {
    return Promise.resolve({
      ok: true,
      objects: ['one.txt', 'two.txt', 'three.txt']
    })
  }
}

const fork = (m) =>
  () => {
    m.fork(
      () => assertEquals(true, false),
      () => assertEquals(true, true)
    )
  }

const events = {
  dispatch: () => null
}

test(
  'put object',
  fork(
    objects
      .put(
        'test',
        'README.md',
        null // fs.createReadStream(path.resolve('../../README.md'))
      )
      .runWith({ svc: mock, events })
  )
)

test(
  'remove bucket',
  fork(objects.remove('beep').runWith({ svc: mock, events }))
)
test('list buckets', fork(objects.list().runWith({ svc: mock, events })))
