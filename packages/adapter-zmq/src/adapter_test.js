const test = require('tape')
const adapter = require('./adapter')
const fetchMock = require('fetch-mock')

globalThis.fetch = fetchMock
  .post('https://jsonplaceholder.typicode.com/posts', {
    status: 201,
    body: {ok: true}
  })
  .sandbox()


test('queue adapter', async t => {
  const a = await adapter({port: '4000'})

  await a.create({name: 'foo', target: 'https://jsonplaceholder.typicode.com/posts'})
  const res = await a.post({name: 'foo', job: { hello: 'world'} })
  t.ok(res.ok)
  t.end()
  process.exit(0)
})
