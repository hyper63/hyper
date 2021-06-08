const test = require('tape')
const { v4 } = require('uuid')
const adapter = require('./adapter')('./')
const values = require('pull-stream/sources/values')
const pull = require('pull-stream/pull')
const concat = require('pull-stream/sinks/concat')

const toStream = require('pull-stream-to-stream')
const toPull = require('stream-to-pull-stream')

test('fs adapter make bucket', async t => {
  t.plan(1)
  const bucket = v4()
  const result = await adapter.makeBucket(bucket)
  t.ok(result.ok)
  await adapter.removeBucket(bucket)
})

test('fs adapter put object', async t => {
  t.plan(1)
  // setup
  const bucket = v4()
  const object = v4() + '.tmp'
  await adapter.makeBucket(bucket)

  // test
  const stream = toStream.source(values(['hello', 'world']))

  const result = await adapter.putObject({
    bucket,
    object,
    stream
  })
  t.ok(result.ok)

  // clean up

  // remove file
  await adapter.removeObject({
    bucket,
    object
  })
  // remove Bucket
  await adapter.removeBucket(bucket).catch(err => {
    console.log(JSON.stringify(err))
    return { ok: false }
  })
})

test('fs adapter get object', async t => {
  const bucket = v4()
  const object = v4() + '.tmp'
  await adapter.makeBucket(bucket)

  const stream = toStream.source(values(['hello', 'world']))
  await adapter.putObject({
    bucket,
    object,
    stream
  })
  // test
  const s = await adapter.getObject({
    bucket,
    object
  })
  await new Promise((resolve) => {
    pull(
      toPull.source(s),
      concat(async (_err, data) => {
        t.equal(data, 'helloworld')
        // cleanup
        // remove file
        await adapter.removeObject({
          bucket,
          object
        })
        // remove Bucket
        await adapter.removeBucket(bucket).catch(() => {
          return { ok: false }
        })
        resolve()
      })
    )
  })
  t.end()
})

test('list files', async t => {
  const list = await adapter.listObjects({
    bucket: 'node_modules'
  })
  t.ok(
    list.find(file => file === 'tape')
  )
  t.end()
})
