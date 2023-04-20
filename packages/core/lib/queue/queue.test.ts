// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assert, assertEquals } from '../../dev_deps.ts'

import * as queue from './queue.ts'

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
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('queue - queue', async (t) => {
  await t.step('index', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .index()
        .map(() => assert(true))
        .runWith({ svc: mockService, events: mockEvents })
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
        .runWith({ svc: mockService, events: mockEvents })
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
          .runWith({ svc: mockService, events: mockEvents })
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
          .runWith({ svc: mockService, events: mockEvents })
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
          .runWith({ svc: mockService, events: mockEvents })
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
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })
    })
  })

  await t.step('del', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await queue
        .del('foobar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'foobar')
        })
        .runWith({ svc: mockService, events: mockEvents })
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
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })
})
