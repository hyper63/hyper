// deno-lint-ignore-file ban-ts-comment no-explicit-any
// TODO: Tyler. Probably better way to do this
import { crocks, express } from '../deps.ts'
import { assertEquals, assertObjectMatch } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { crawler } from './crawler.ts'

const services: any = {
  crawler: {
    remove: (bucket: any, name: any) => crocks.Async.Resolved({ ok: true, bucket, name }),
    get: (bucket: any, name: any) =>
      crocks.Async.Resolved({
        id: 'test-spider',
        app: 'test',
        source: 'https://example.com',
        depth: 2,
        script: '',
        target: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          sub: '1234',
          aud: 'https://example.com',
          secret: 'secret',
        },
        notify: 'https://example.com',
        bucket,
        name,
      }),
    start: (bucket: any, name: any) => crocks.Async.Resolved({ ok: true, bucket, name }),
    upsert: ({ app, name, ...rest }: any) =>
      crocks.Async.Resolved({ ok: true, bucket: app, name, def: rest }),
  },
  middleware: [],
}

// @ts-ignore
const app = crawler(services)(express())

Deno.test('crawler', async (t) => {
  const harness = createHarness(app)

  await t.step('PUT /crawler/:bucket/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/crawler/test/spider', { method: 'PUT' }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })

    await t.step(
      'should pass the name and bucket params, and body to core',
      async () => {
        const crawlerDefinition = {
          source: 'https://example.com',
          depth: 2,
          script: '',
          target: {
            url: 'https://jsonplaceholder.typicode.com/posts',
            sub: '1234',
            aud: 'https://example.com',
            secret: 'secret',
          },
          notify: 'https://example.com',
        }

        await harness
          .start()
          .then(() =>
            harness('/crawler/test/spider', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(crawlerDefinition),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.bucket, 'test')
                assertEquals(body.name, 'spider')
                assertObjectMatch(body.def, crawlerDefinition)
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('GET /crawler/:bucket/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/crawler/test/spider').then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })

    await t.step(
      'should pass the bucket and name route params to core',
      async () => {
        await harness
          .start()
          .then(() => harness('/crawler/test/spider'))
          .then((res) => res.json())
          .then((body) => {
            assertEquals(body.bucket, 'test')
            assertEquals(body.name, 'spider')
          })
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('POST /crawler/:bucket/:name/_start', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/crawler/test/spider/_start', { method: 'POST' }).then(
            (res) => {
              assertEquals(
                res.headers.get('content-type'),
                'application/json; charset=utf-8',
              )
              return res.body?.cancel()
            },
          )
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })

    await t.step(
      'should pass the bucket and name route params to core',
      async () => {
        await harness
          .start()
          .then(() => harness('/crawler/test/spider/_start', { method: 'POST' }))
          .then((res) => res.json())
          .then((body) => {
            assertEquals(body.bucket, 'test')
            assertEquals(body.name, 'spider')
          })
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('DELETE /crawler/:bucket/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/crawler/test/spider', { method: 'DELETE' }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })

    await t.step(
      'should pass the bucket and name route params to core',
      async () => {
        await harness
          .start()
          .then(() => harness('/crawler/test/spider', { method: 'DELETE' }))
          .then((res) => res.json())
          .then((body) => {
            assertEquals(body.bucket, 'test')
            assertEquals(body.name, 'spider')
          })
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })
})
