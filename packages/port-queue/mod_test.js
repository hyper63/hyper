// deno-lint-ignore-file no-unused-vars

import { queue as queuePort } from './mod.js'
import { assertEquals } from './dev_deps.js'

const test = Deno.test

const adapter = {
  index: () => {
    return Promise.resolve([])
  },
  create: (input) => {
    return Promise.resolve({
      ok: true,
      msg: 'success',
    })
  },
  post: (input) => {
    return Promise.resolve({
      ok: true,
      msg: 'success',
    })
  },
  delete: (name) => {
    return Promise.resolve({ ok: true })
  },
  get: (input) => {
    return Promise.resolve({
      ok: true,
      jobs: [{
        id: '1',
        action: 'email',
        subject: 'Hello',
        body: 'world',
        to: 'foo@email.com',
        from: 'dnr@foo.com',
      }],
    })
  },
  cancel: (input) => Promise.resolve({ ok: true }),
  retry: (input) => Promise.resolve({ ok: true, status: 201 }),
}

const badAdapter = {
  index: () => Promise.reject({ ok: false, msg: 'could not create list' }),
  create: (input) => Promise.reject({ ok: false, msg: 'badfood' }),
  post: (input) => Promise.reject({ ok: false, msg: 'badfood' }),
  delete: (name) => Promise.reject({ ok: false }),
  get: (input) => Promise.reject({ ok: false }),
  cancel: (input) => Promise.reject({ ok: false }),
  retry: (input) => Promise.reject({ ok: false }),
}

test('create a queue success', async (t) => {
  const x = queuePort(adapter)
  let res = await x.create({
    name: 'test',
    target: 'https://example.com',
    secret: 'somesecret',
  })
  assertEquals(res.ok, true)
  res = await x.post({
    name: 'test',
    job: {
      action: 'email',
      subject: 'Hello',
      body: 'world',
      to: 'foo@email.com',
      from: 'dnr@foo.com',
    },
  })
  assertEquals(res.ok, true)
  res = await x.get({
    name: 'test',
    status: 'ERROR',
  })
  assertEquals(res.ok, true)
})

test('create a queue failure', async () => {
  const x = queuePort(badAdapter)
  let res = await x.create({ name: 'foo', target: 'bar' }).catch((err) => err)
  assertEquals(res.ok, undefined)
  res = await x.post({ name: 'foo', job: {} }).catch((err) => err)
  assertEquals(res.ok, false)
})
