// deno-lint-ignore-file no-unused-vars ban-ts-comment

import { crawler, type CrawlerPort } from './mod.ts'
import { assert, assertRejects } from './dev_deps.ts'

const crawlerJob = {
  app: 'app',
  name: 'name',
  source: 'https://example.com',
  script: '',
  depth: 1,
  target: {
    url: 'https://target.com',
    secret: 'secret',
    sub: 'sub',
  },
  notify: 'https://notify.com',
}

const impl: CrawlerPort = {
  upsert: (o) => Promise.resolve({ ok: true }),
  get: (o) =>
    Promise.resolve({
      id: 'app-name',
      ...crawlerJob,
    }),
  start: (o) => Promise.resolve({ ok: true }),
  delete: (o) => Promise.resolve({ ok: true }),
}

Deno.test('crawler', async (t) => {
  const adapter = crawler(impl)

  await t.step('upsert', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(await adapter.upsert(crawlerJob))

      // @ts-ignore
      await assertRejects(() => adapter.upsert(123))
    })

    await t.step('should validate the outputs', async () => {
      assert((await adapter.upsert(crawlerJob)).ok)

      const withBadOutput = crawler({
        ...impl,
        upsert: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() => withBadOutput.upsert(crawlerJob))
    })
  })

  await t.step('start', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.start({
          app: 'app',
          name: 'name',
        }),
      )

      await assertRejects(() =>
        adapter.start({
          // @ts-ignore
          app: 123,
          name: 'name',
        })
      )

      await assertRejects(() =>
        adapter.start({
          app: 'app',
          // @ts-ignore
          name: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.start({
            app: 'app',
            name: 'name',
          })
        ).ok,
      )

      const withBadOutput = crawler({
        ...impl,
        start: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.start({
          app: 'app',
          name: 'name',
        })
      )
    })
  })

  await t.step('get', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.get({
          app: 'app',
          name: 'name',
        }),
      )

      await assertRejects(() =>
        adapter.get({
          // @ts-ignore
          app: 123,
          name: 'name',
        })
      )

      await assertRejects(() =>
        adapter.get({
          app: 'app',
          // @ts-ignore
          name: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        await adapter.get({
          app: 'app',
          name: 'name',
        }),
      )

      const withBadOutput = crawler({
        ...impl,
        get: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.get({
          app: 'app',
          name: 'name',
        })
      )
    })
  })

  await t.step('delete', async (t) => {
    await t.step('should validate the inputs', async () => {
      assert(
        await adapter.delete({
          app: 'app',
          name: 'name',
        }),
      )

      await assertRejects(() =>
        adapter.delete({
          // @ts-ignore
          app: 123,
          name: 'name',
        })
      )

      await assertRejects(() =>
        adapter.delete({
          app: 'app',
          // @ts-ignore
          name: 123,
        })
      )
    })

    await t.step('should validate the outputs', async () => {
      assert(
        (
          await adapter.delete({
            app: 'app',
            name: 'name',
          })
        ).ok,
      )

      const withBadOutput = crawler({
        ...impl,
        delete: () => Promise.resolve({ ok: 123 }),
      })
      await assertRejects(() =>
        withBadOutput.delete({
          app: 'app',
          name: 'name',
        })
      )
    })
  })
})
