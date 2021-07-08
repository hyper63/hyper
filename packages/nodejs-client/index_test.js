const test = require('tape')
const fetchMock = require('fetch-mock')

globalThis.fetch = fetchMock
  .get('https://nano.hyper63.com/data/bar', { status: 200, body: { ok: true, docs: [] } })
  .put('https://nano.hyper63.com/search/bar', {
    status: 201,
    body: { ok: true }
  })
  .post('https://nano.hyper63.com/data/bar/_bulk', { status: '200', body: { ok: true, results: [] } })
  .put('https://nano.hyper63.com/queue/foo', { status: 201, body: { ok: true } })
  .put('https://nano.hyper63.com/queue/bar', { status: 201, body: { ok: true } })
  .post('https://nano.hyper63.com/queue/bar', { status: 200, body: {ok: true }})
  .post('https://nano.hyper63.com/queue/foo', { status: 200, body: {ok: true }})
  
  .sandbox()

// globalThis.fetch = fetch

const client = require('./index')
const services = client('https://nano.hyper63.com', 'foo', 'secret', 'bar')

test('get data', t => {
  t.plan(1)
  services.data.list()
    .fork(
      e => {
        console.log(e)
        t.ok(false)
      },
      r => t.ok(r.ok)

    )
})

test('create search index', t => {
  t.plan(1)
  services.setup.search({ fields: ['title'] })
    .fork(
      e => {
        console.log(e)
        t.ok(false)
      },
      r => {
        console.log(r)
        t.ok(r.ok)
      }
    )
})

test('post bulk docs', t => {
  t.plan(1)
  services.data.bulk([{ id: '1', name: 'hello' }, { id: '2', name: 'world' }])
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    )
})

test('create queue with app name', t => {
  t.plan(1)
  services.setup.queue('https://jsonplaceholder.typicode.com/posts', { app: 'bar' })
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    )
})

test('create queue with default app', t => {
  t.plan(1)
  services.setup.queue('https://jsonplaceholder.typicode.com/posts')
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    )
})

test('post job to specific queue', t => {
  t.plan(1)
  services.queue.post({ hello: 'world'}, {app: 'bar'})
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    )
})


test('post job to default queue', t => {
  t.plan(1)
  services.queue.post({ hello: 'world'})
    .fork(
      () => t.ok(false),
      () => t.ok(true)
    )
})