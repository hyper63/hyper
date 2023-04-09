// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assert, assertEquals } from '../../dev_deps.ts'

import * as store from './store.ts'

const mockService = {
  index: () => Promise.resolve({ ok: true }),
  createStore: (name: any) =>
    Promise.resolve({
      ok: true,
      name,
    }),
  destroyStore: (name: any) => Promise.resolve({ ok: true, name }),
  listDocs: (arg: any) => Promise.resolve({ ok: true, ...arg }),
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('cache - store', async (t) => {
  await t.step('index', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await store
        .index()
        .map(() => assert(true))
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })
  })

  await t.step('create', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await store
        .create('hello')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'hello')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step(
      'should lowercase the name passed to the adapter',
      async () => {
        await store
          .create('Hello')
          .map((res) => {
            // @ts-expect-error
            assertEquals(res.name, 'hello')
          })
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
      },
    )

    await t.step('should reject if the name is invalid', async (t) => {
      await t.step('does not start with alphanumeric', async () => {
        await store
          .create('_foo')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains a space', async () => {
        await store
          .create('foo bar')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains a slash', async () => {
        await store
          .create('foo/bar')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains non URI friendly character', async () => {
        await store
          .create('foo?bar')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })
    })
  })

  await t.step('delete', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await store
        .del('hello')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.name, 'hello')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step('should reject if the name is invalid', async (t) => {
      await t.step('does not start with alphanumeric', async () => {
        await store
          .del('_foo')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains a space', async () => {
        await store
          .del('foo bar')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains a slash', async () => {
        await store
          .del('foo/bar')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains non URI friendly character', async () => {
        await store
          .del('foo?bar')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })
    })
  })

  await t.step('query', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await store
        .query('hello', 'foo*')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.store, 'hello')
          // @ts-expect-error
          assertEquals(res.pattern, 'foo*')
        })
        .runWith({ svc: mockService, events: mockEvents })
        .toPromise()
    })

    await t.step('should reject if the name is invalid', async (t) => {
      await t.step('does not start with alphanumeric', async () => {
        await store
          .query('_foo', 'foo*')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains a space', async () => {
        await store
          .query('foo bar', 'foo*')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains a slash', async () => {
        await store
          .query('foo/bar', 'foo*')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })

      await t.step('contains non URI friendly character', async () => {
        await store
          .query('foo?bar', 'foo*')
          .runWith({ svc: mockService, events: mockEvents })
          .toPromise()
          .then(() => assert(false))
          .catch(() => assert(true))
      })
    })
  })
})
