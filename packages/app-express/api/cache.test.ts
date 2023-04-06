// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks, express } from '../deps.ts'
import { assertEquals } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { cache } from './cache.ts'

const services: any = {
  cache: {
    createStore: (name: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
      }),
    deleteStore: (name: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
      }),
    queryStore: (name: any, pattern: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
        pattern,
      }),
    createDoc: (name: any, key: any, value: any, ttl: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
        key,
        value,
        ttl,
      }),
    getDoc: (name: any, key: any, isLegacyGetEnabled: any) =>
      crocks.Async.Resolved({
        ok: true,
        doc: { _id: key, name, isLegacyGetEnabled },
      }),
    updateDoc: (name: any, key: any, value: any, ttl: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
        key,
        value,
        ttl,
      }),
    deleteDoc: (name: any, key: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
        key,
      }),
  },
  middleware: [],
}

// @ts-ignore
const app = cache(services)(express())

Deno.test('cache', async (t) => {
  const harness = createHarness(app)

  await t.step('PUT /cache/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies', { method: 'PUT' }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass name route param to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies', { method: 'PUT' })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.name, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('DELETE /cache/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies', { method: 'DELETE' }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass name route param to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies', { method: 'DELETE' })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.name, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('POST|GET /cache/:name/_query', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies/_query?pattern=foo*', { method: 'POST' }).then(
            (res) => {
              assertEquals(
                res.headers.get('content-type'),
                'application/json; charset=utf-8',
              )
              return res.body?.cancel()
            },
          )
        )
        .finally(async () => await harness.stop())

      await harness
        .start()
        .then(() =>
          harness('/cache/movies/_query?pattern=foo*', { method: 'GET' }).then(
            (res) => {
              assertEquals(
                res.headers.get('content-type'),
                'application/json; charset=utf-8',
              )
              return res.body?.cancel()
            },
          )
        )
        .finally(async () => await harness.stop())
    })

    await t.step(
      'should pass name route param and query pattern to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/cache/movies/_query?pattern=foo*', { method: 'GET' })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.name, 'movies')
                assertEquals(body.pattern, 'foo*')
              })
          )
          .finally(async () => await harness.stop())

        await harness
          .start()
          .then(() =>
            harness('/cache/movies/_query?pattern=foo*', { method: 'POST' })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.name, 'movies')
                assertEquals(body.pattern, 'foo*')
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })

  await t.step('POST /cache/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies', {
            method: 'POST',
            body: JSON.stringify({
              key: '1',
              value: { foo: 'bar' },
              ttl: '1m',
            }),
          }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass name route param and body to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies', {
            method: 'POST',
            body: JSON.stringify({
              key: '1',
              value: { foo: 'bar' },
              ttl: '1m',
            }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.name, 'movies')
              assertEquals(body.key, '1')
              assertEquals(body.value, { foo: 'bar' })
              assertEquals(body.ttl, '1m')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('GET /cache/:name/:id', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies/key').then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass name and key route params to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies/key')
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.doc._id, 'key')
              assertEquals(body.doc.name, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass isLegacyGetEnabled to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies/key', {
            headers: {
              'X-HYPER-LEGACY-GET': 'true',
            },
          })
            .then((res) => res.json())
            .then((withLegacy) => {
              assertEquals(withLegacy.doc.isLegacyGetEnabled, true)
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('PUT /cache/:name/:key', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies/1?ttl=1m', {
            method: 'PUT',
            body: JSON.stringify({ foo: 'bar' }),
          }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step(
      'should pass name and key route param, ttl query, and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/cache/movies/1?ttl=1m', {
              method: 'PUT',
              body: JSON.stringify({ foo: 'bar' }),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.name, 'movies')
                assertEquals(body.key, '1')
                assertEquals(body.value, { foo: 'bar' })
                assertEquals(body.ttl, '1m')
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })

  await t.step('DELETE /cache/:name/:id', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies/key', { method: 'DELETE' }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass name and key route params to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/cache/movies/key', { method: 'DELETE' })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.name, 'movies')
              assertEquals(body.key, 'key')
            })
        )
        .finally(async () => await harness.stop())
    })
  })
})
