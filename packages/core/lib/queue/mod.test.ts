// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assert, assertEquals } from '../../dev_deps.ts'

import builder from './mod.ts'

const mockService = {
  index: () => Promise.resolve({ ok: true }),
  create({ name, secret, target }: any) {
    return Promise.resolve({ ok: true, name, secret, target })
  },
  delete(name: any) {
    return Promise.resolve({ ok: true, name })
  },
  get({ name, status }: any) {
    return Promise.resolve({ ok: true, name, status })
  },
  post({ name, job }: any) {
    return Promise.resolve({ ok: true, name, job })
  },
  cancel({ name, id }: any) {
    return Promise.resolve({ ok: true, name, id })
  },
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('queue', async (t) => {
  const queue = builder({
    queue: mockService,
    events: mockEvents,
  } as unknown as any)

  await t.step('index', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .index()
        .map(() => assert(true))
        .toPromise()
    })
  })

  await t.step('create', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .create({
          name: 'foobar',
          secret: 'shhh',
          target: 'https://foo.bar',
        })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
          // @ts-expect-error
          assertEquals(res.secret, 'shhh')
          // @ts-expect-error
          assertEquals(res.target, 'https://foo.bar')
        })
        .toPromise()
    })

    await t.step(
      'should lowercase the name passed to the adapter',
      async () => {
        await queue
          .create({
            name: 'Foobar',
            secret: 'shhh',
            target: 'https://foo.bar',
          })
          .map((res) => {
            // @ts-expect-error
            assertEquals(res.name, 'foobar')
          })
          .toPromise()
      },
    )

    await t.step('should reject if the name is invalid', async (t) => {
      await t.step('contains a space', async () => {
        await queue
          .create({
            name: 'foo bar',
            secret: 'shhh',
            target: 'https://foo.bar',
          })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains a slash', async () => {
        await queue
          .create({
            name: 'foo/bar',
            secret: 'shhh',
            target: 'https://foo.bar',
          })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains non URI friendly character', async () => {
        await queue
          .create({
            name: 'foo?bar',
            secret: 'shhh',
            target: 'https://foo.bar',
          })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })
    })
  })

  await t.step('delete', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .delete('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .toPromise()
    })
  })

  await t.step('list', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .list({ name: 'foobar', status: 'READY' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
          assertEquals(res.status, 'READY')
        })
        .toPromise()
    })
  })

  await t.step('post', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .post({ name: 'foobar', job: { type: 'FOO_JOB' } })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
          // @ts-expect-error
          assertEquals(res.job, { type: 'FOO_JOB' })
        })
        .toPromise()
    })
  })

  await t.step('cancel', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .cancel({ name: 'foobar', id: '1234' })
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
          // @ts-expect-error
          assertEquals(res.id, '1234')
        })
        .toPromise()
    })
  })
})
