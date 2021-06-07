import { default as test } from 'tape'
import adapter from './adapter'
import fetchMock from 'fetch-mock'

globalThis.fetch = fetchMock
  .post('https://jsonplaceholder.typicode.com/posts', (req) => {
    return { status: 200, body: { hello: 'world' } }
  })
  .sandbox()

test('test queue', async t => {
  const a = adapter({ redis: 'redis://localhost:6379' })
  await a.create({
    name: 'foo',
    target: 'https://jsonplaceholder.typicode.com/posts'
  })

  const res = await a.post({
    name: 'foo',
    job: { hello: 'world' }
  })

  t.ok(res.ok)
  // teardown
  setTimeout(() => {
    a.delete('foo')
      .then(() => process.exit(0))
  }, 2000)
})
