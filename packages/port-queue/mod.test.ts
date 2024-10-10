// deno-lint-ignore-file no-unused-vars ban-ts-comment
import { assert, assertRejects } from '@std/assert'

import { queue, type QueuePort } from './mod.ts'

const impl: QueuePort = {
  index: () => {
    return Promise.resolve({ ok: true, queues: ['foobar'] })
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
      jobs: [
        {
          id: '1',
          action: 'email',
          subject: 'Hello',
          body: 'world',
          to: 'foo@email.com',
          from: 'dnr@foo.com',
        },
      ],
    })
  },
  cancel: (input) => Promise.resolve({ ok: true }),
  retry: (input) => Promise.resolve({ ok: true }),
}

Deno.test('queue', async (t) => {
  const adapter = queue(impl)

  await t.step('index', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.index())
    })

    await t.step('should validate the outputs', async () => {
      // @ts-ignore
      assert((await adapter.index()).queues)

      const withBadOutput = queue({
        ...impl,
        index: () => Promise.resolve({ ok: true, queues: [123] }),
      })
      await assertRejects(() => withBadOutput.index())
    })
  })

  await t.step('create', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.create({
          name: 'foo',
          target: 'http://foo.bar',
          secret: 'secret',
        }),
      )

      await assertRejects(() =>
        adapter.create({
          // @ts-ignore
          name: 123,
          target: 'http://foo.bar',
          secret: 'secret',
        })
      )
      await assertRejects(() =>
        adapter.create({ name: 'foo', target: 'not a url', secret: 'secret' })
      )
      await assertRejects(() =>
        // @ts-ignore
        adapter.create({ name: 'foo', target: 'http://foo.bar', secret: 123 })
      )
      // @ts-ignore
      await assertRejects(() =>
        adapter.create({
          name: 'foo',
          target: 'http://foo.bar',
          secret: 'z'.repeat(1000),
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.create({
            name: 'foo',
            target: 'http://foo.bar',
            secret: 'secret',
          })
        ).ok,
      )

      const withBadOutput = queue({
        ...impl,
        create: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.create({
          name: 'foo',
          target: 'http://foo.bar',
          secret: 'secret',
        })
      )
    })
  })

  await t.step('delete', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.delete('foobar'))

      // @ts-ignore
      await assertRejects(() => adapter.delete(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.delete('foobar')).ok)

      const withBadOutput = queue({
        ...impl,
        delete: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.delete('foobar'))
    })
  })

  await t.step('post', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.post({
          name: 'foo',
          job: { type: 'SEND_EMAIL', hello: 'world' },
        }),
      )

      await assertRejects(() =>
        // @ts-ignore
        adapter.post({ name: 123, job: { type: 'SEND_EMAIL', hello: 'world' } })
      )
      // @ts-ignore
      await assertRejects(() => adapter.post({ name: 'foo', job: 123 }))
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.post({
            name: 'foo',
            job: { type: 'SEND_EMAIL', hello: 'world' },
          })
        ).ok,
      )

      const withBadOutput = queue({
        ...impl,
        post: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.post({
          name: 'foo',
          job: { type: 'SEND_EMAIL', hello: 'world' },
        })
      )
    })
  })

  await t.step('get', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.get({ name: 'foo', status: 'READY' }))
      assert(await adapter.get({ name: 'foo', status: 'ERROR' }))

      // @ts-ignore
      await assertRejects(() => adapter.get({ name: 123, status: 'READY' }))
      // @ts-ignore
      await assertRejects(() => adapter.get({ name: 123, status: 123 }))
      // @ts-ignore
      await assertRejects(() => adapter.get({ name: 123, status: 'FOOBAR' }))
    })

    await t.step('should validate the outputs', async () => {
      // @ts-ignore
      assert((await adapter.get({ name: 'foo', status: 'READY' })).jobs)

      const withBadOutput = queue({
        ...impl,
        get: () => Promise.resolve({ ok: true, jobs: [123] }),
      })
      await assertRejects(() => withBadOutput.get({ name: 'foo', status: 'READY' }))
    })
  })

  await t.step('retry', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.retry({ name: 'foo', id: 'bar' }))

      // @ts-ignore
      await assertRejects(() => adapter.retry({ name: 123, id: 'bar' }))
      // @ts-ignore
      await assertRejects(() => adapter.retry({ name: 'foo', id: 123 }))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.retry({ name: 'foo', id: '123' })).ok)

      const withBadOutput = queue({
        ...impl,
        retry: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.retry({ name: 'foo', id: '123' }))
    })
  })

  await t.step('cancel', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.cancel({ name: 'foo', id: 'bar' }))

      // @ts-ignore
      await assertRejects(() => adapter.cancel({ name: 123, id: 'bar' }))
      // @ts-ignore
      await assertRejects(() => adapter.cancel({ name: 'foo', id: 123 }))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.cancel({ name: 'foo', id: '123' })).ok)

      const withBadOutput = queue({
        ...impl,
        cancel: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.cancel({ name: 'foo', id: '123' }))
    })
  })
})
