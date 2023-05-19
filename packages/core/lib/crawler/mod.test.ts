// deno-lint-ignore-file no-explicit-any ban-ts-comment
import { assertEquals, base64Encode } from '../../dev_deps.ts'

import builder from './mod.ts'

const mockService = {
  upsert: (job: any) => {
    return Promise.resolve({ ok: true, job })
  },
  get: (arg: any) => Promise.resolve({ ok: true, ...arg }),
  delete: (arg: any) => Promise.resolve({ ok: true, ...arg }),
  start: (arg: any) => Promise.resolve({ ok: true, ...arg }),
}

const mockEvents = {
  dispatch: () => null,
}

Deno.test('crawler', async (t) => {
  const crawler = builder({
    crawler: mockService,
    events: mockEvents,
  } as unknown as any)

  await t.step('upsert', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      const jobDef = {
        app: 'test',
        name: 'secret',
        source: 'https://example.com',
        depth: 2,
        script: base64Encode(`
          let content = '';
          document.querySelectorAll('main p').forEach(el => content = content.concat('\n', el.textContent));
          return { title: document.title, content };`),
        target: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          secret: 'secret',
          sub: 'SPIDER',
          aud: 'https://example.com',
        },
        notify: 'https://example.com',
      }

      await crawler
        .upsert(jobDef)
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.job, jobDef)
        })
        .toPromise()
    })
  })

  await t.step('get', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await crawler
        .get('foo', 'bar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.app, 'foo')
          // @ts-expect-error
          assertEquals(res.name, 'bar')
        })
        .toPromise()
    })
  })

  await t.step('remove', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await crawler
        .remove('foo', 'bar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.app, 'foo')
          // @ts-expect-error
          assertEquals(res.name, 'bar')
        })
        .toPromise()
    })
  })

  await t.step('start', async (t) => {
    await t.step('should pass the values to the adapter', async () => {
      await crawler
        .start('foo', 'bar')
        .map((res) => {
          // @ts-expect-error
          assertEquals(res.app, 'foo')
          // @ts-expect-error
          assertEquals(res.name, 'bar')
        })
        .toPromise()
    })
  })
})
