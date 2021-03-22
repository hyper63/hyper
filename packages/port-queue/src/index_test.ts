import { default as test } from 'tape'
import queuePort, { QueuePort, QueueCreateInput, QueuePostInput, QueueResponse,
  QueueGetInput, JobsResponse, JobInput } from './index'

const adapter : QueuePort = {
  create: (input: QueueCreateInput) : Promise<QueueResponse> => {
    return Promise.resolve({
      ok: true,
      msg: 'success'
    })
  },
  post: (input: QueuePostInput) : Promise<QueueResponse> => {
    return Promise.resolve({
      ok: true,
      msg: 'success'
    })
  },
  'delete': (name: string) : Promise<QueueResponse> => {
    return Promise.resolve({ok: true})
  },
  get: (input: QueueGetInput) : Promise<JobsResponse> => {
    return Promise.resolve({
      ok: true,
      jobs: [{
        id: '1',
        action: 'email', 
        subject: 'Hello',
        body: 'world',
        to: 'foo@email.com',
        from: 'dnr@foo.com'
      }]
    })
  },
  cancel: (input: JobInput) : Promise<QueueResponse> => 
    Promise.resolve({ok: true}),
  retry: (input: JobInput) : Promise<QueueResponse> => 
    Promise.resolve({ok: true, status: 201})

}

const badAdapter : QueuePort = {
  create: (input: QueueCreateInput) => Promise.reject({ok: false, msg: 'badfood'}),
  post: (input: QueuePostInput) => Promise.reject({ok: false, msg: 'badfood'}),
  'delete': (name: string) => Promise.reject({ok: false}),
  get: (input: QueueGetInput) => Promise.reject({ok: false}),
  cancel: (input: JobInput) => Promise.reject({ok: false}),
  retry: (input: JobInput) => Promise.reject({ok: false})

}

test('create a queue success', async t => {
  t.plan(3)
  const x = queuePort(adapter)
  let res = await x.create({
    name: 'test',
    target: 'https://example.com',
    secret: 'somesecret'
  })
  t.ok(res.ok)
  res = await x.post({
    name: 'test',
    job: {
      action: 'email', 
      subject: 'Hello',
      body: 'world',
      to: 'foo@email.com',
      from: 'dnr@foo.com'
    }
  })
  t.ok(res.ok)
  res = await x.get({
    name: 'test', 
    status: 'ERROR'
  })
  t.ok(res.ok)
  

})

test('create a queue failure', async t => {
  t.plan(2)
  const x = queuePort(badAdapter)
  let res = await x.create({name: 'foo', target: 'bar'}).catch(err => err)
  t.notOk(res.ok)
  res = await x.post({name: 'foo', job: {}}).catch(err => err)
  t.notOk(res.ok)
})
