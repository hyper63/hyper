// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks, express } from '../deps.ts'
import { assertEquals, assertObjectMatch } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { search } from './search.ts'

const services: any = {
  search: {
    createIndex: (index: any, mapping: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
        mapping,
      }),
    deleteIndex: (index: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
      }),
    indexDoc: (index: any, key: any, doc: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
        key,
        doc,
      }),
    getDoc: (index: any, key: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
        key,
      }),
    updateDoc: (index: any, key: any, doc: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
        key,
        doc,
      }),
    removeDoc: (index: any, key: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
        key,
      }),
    query: (index: any, query: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
        query,
      }),
    bulk: (index: any, docs: any) =>
      crocks.Async.Resolved({
        ok: true,
        index,
        docs,
      }),
  },
}

// @ts-ignore
const app = search(services)(express())

Deno.test('search', async (t) => {
  const harness = createHarness(app)

  await t.step('PUT /search/:index', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies', {
            method: 'PUT',
            body: JSON.stringify({
              fields: ['foo'],
              storeFields: ['foo', 'bar'],
            }),
          }).then((res) => {
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
      'should pass index route params and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/search/movies', {
              method: 'PUT',
              body: JSON.stringify({
                fields: ['foo'],
                storeFields: ['foo', 'bar'],
              }),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.index, 'movies')
                assertObjectMatch(body.mapping, {
                  fields: ['foo'],
                  storeFields: ['foo', 'bar'],
                })
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('DELETE /search/:index', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies', {
            method: 'DELETE',
          }).then((res) => {
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

    await t.step('should pass index route params to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies', {
            method: 'DELETE',
          })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.index, 'movies')
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })
  })

  await t.step('POST /search/:index', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies', {
            method: 'POST',
            body: JSON.stringify({
              key: '1',
              doc: { foo: 'bar' },
            }),
          }).then((res) => {
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
      'should pass index and key route params and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/search/movies', {
              method: 'POST',
              body: JSON.stringify({
                key: '1',
                doc: { foo: 'bar' },
              }),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.index, 'movies')
                assertEquals(body.key, '1')
                assertEquals(body.doc, { foo: 'bar' })
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('GET /search/:index/:key', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies/1').then((res) => {
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

    await t.step('should pass index and key route params to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies/1')
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.index, 'movies')
              assertEquals(body.key, '1')
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })
  })

  await t.step('PUT /search/:index/:key', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies/1', {
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
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })

    await t.step(
      'should pass index and key route params and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/search/movies/1', {
              method: 'PUT',
              body: JSON.stringify({ foo: 'bar' }),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.index, 'movies')
                assertEquals(body.key, '1')
                assertEquals(body.doc, { foo: 'bar' })
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('DELETE /search/:index/:key', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies/1', { method: 'DELETE' }).then((res) => {
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

    await t.step('should pass index and key route params to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies/1', { method: 'DELETE' })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.index, 'movies')
              assertEquals(body.key, '1')
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })
  })

  await t.step('POST /search/:index/_query', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies/_query', {
            method: 'POST',
            body: JSON.stringify({
              query: 'foobar',
            }),
          }).then((res) => {
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
      'should pass index route params and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/search/movies/_query', {
              method: 'POST',
              body: JSON.stringify({
                query: 'foobar',
              }),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.index, 'movies')
                assertEquals(body.query, { query: 'foobar' })
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('POST /search/:index/_bulk', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/search/movies/_bulk', {
            method: 'POST',
            body: JSON.stringify([{ foo: 'bar' }, { fizz: 'buzz' }]),
          }).then((res) => {
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
      'should pass index route params and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/search/movies/_bulk', {
              method: 'POST',
              body: JSON.stringify([{ foo: 'bar' }, { fizz: 'buzz' }]),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.index, 'movies')
                assertEquals(body.docs[0], { foo: 'bar' })
                assertEquals(body.docs[1], { fizz: 'buzz' })
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })
})
