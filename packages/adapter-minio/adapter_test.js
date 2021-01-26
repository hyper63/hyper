const test = require('tape')
const createAdapter = require('./adapter')

const client = ({
  makeBucket(name) {
    return Promise.resolve()
  },
  removeBucket(name) {
    return Promise.resolve()
  }
})

const adapter = createAdapter(client)

test('make bucket', async t => {
  const result = await adapter.makeBucket('hello')
  t.ok(result.ok)
  t.end()
})

test('remove bucket', async t => {
  const result = await adapter.removeBucket('hello')
  t.ok(result.ok)
  t.end()
})