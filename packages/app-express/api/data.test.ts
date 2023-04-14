// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks, express } from '../deps.ts'
import { assert, assertEquals, assertObjectMatch } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { data } from './data.ts'

const services: any = {
  data: {
    createDatabase: (db: any) => crocks.Async.Resolved({ ok: true, db }),
    destroyDatabase: (db: any) => crocks.Async.Resolved({ ok: true, db }),
    createDocument: (db: any, doc: any) => crocks.Async.Resolved({ ok: true, db, doc }),
    getDocument: (db: any, id: any, isLegacyGetEnabled: any) =>
      crocks.Async.Resolved({
        ok: true,
        doc: { _id: id, db, isLegacyGetEnabled },
      }),
    updateDocument: (db: any, id: any, doc: any) =>
      crocks.Async.Resolved({ ok: true, db, id, doc }),
    removeDocument: (db: any, id: any) =>
      crocks.Async.Resolved({
        ok: true,
        db,
        id,
      }),
    index: (db: any, name: any, fields: any) =>
      crocks.Async.Resolved({ ok: true, db, name, fields }),
    query: (db: any, query: any) => crocks.Async.Resolved({ ok: true, db, query }),
    bulkDocuments: (db: any, body: any) => crocks.Async.Resolved({ ok: true, db, results: body }),
    listDocuments: (db: any, query: any) => {
      return crocks.Async.Resolved({ ok: true, db, query, docs: [] })
    },
  },
}

// @ts-ignore
const app = data(services)(express())

Deno.test('data', async (t) => {
  const harness = createHarness(app)

  await t.step('PUT /data/:db', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies', { method: 'PUT' }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass db route param to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies', { method: 'PUT' })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.db, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('DELETE /data/:db', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies', { method: 'DELETE' }).then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass db route param to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies', { method: 'DELETE' })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.db, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('GET /data/movies', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies?limit=2&foo=bar').then((res) => {
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
      'should pass the db route param and query params to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies?limit=2&foo=bar')
              .then((res) => res.json())
              .then((body) => {
                assert(body.ok)
                assertEquals(body.db, 'movies')
                /**
                 * It is core's job to parse out what it doesn't compute, not the app
                 *
                 * The app just translates from a format ie. http request
                 */
                assertEquals(body.query, { limit: '2', foo: 'bar' })
              })
          )
          .finally(() => harness.stop())
      },
    )

    await t.step(
      'should pass the db route param and empty query params to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies')
              .then((res) => res.json())
              .then((body) => {
                assert(body.ok)
                assertEquals(body.db, 'movies')
                assertEquals(body.query, {})
              })
          )
          .finally(() => harness.stop())
      },
    )

    await t.step(
      'should pass an empty object when no query params are present',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies')
              .then((res) => res.json())
              .then((body) => {
                assert(body.ok)
                assertEquals(body.db, 'movies')
                assertEquals(body.query, {})
              })
          )
          .finally(() => harness.stop())
      },
    )
  })

  await t.step('POST /data/:db', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies', {
            method: 'POST',
            body: JSON.stringify({
              _id: '1',
              foo: 'bar',
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

    await t.step('should pass db route param and body to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies', {
            method: 'POST',
            body: JSON.stringify({
              _id: '1',
              foo: 'bar',
            }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertObjectMatch(body.doc, { _id: '1', foo: 'bar' })
              assertEquals(body.db, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('GET /data/:db/:id', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/1').then((res) => {
            assertEquals(
              res.headers.get('content-type'),
              'application/json; charset=utf-8',
            )
            return res.body?.cancel()
          })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass db and id route params to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/1')
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.doc._id, '1')
              assertEquals(body.doc.db, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })

    await t.step('should pass isLegacyGetEnabled to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/1', {
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

  await t.step('PUT /data/:db/:id', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/1', {
            method: 'PUT',
            body: JSON.stringify({
              _id: '1',
              foo: 'bar',
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

    await t.step(
      'should pass db and id route params and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies/1', {
              method: 'PUT',
              body: JSON.stringify({
                _id: '1',
                foo: 'bar',
              }),
            })
              .then((res) => res.json())
              .then((body) => {
                assertObjectMatch(body.doc, { _id: '1', foo: 'bar' })
                assertEquals(body.id, '1')
                assertEquals(body.db, 'movies')
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })

  await t.step('DELETE /data/:db/:id', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/1', {
            method: 'DELETE',
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
      'should pass db and id route params and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies/1', {
              method: 'DELETE',
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.id, '1')
                assertEquals(body.db, 'movies')
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })

  await t.step('POST /data/:db/_index', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/_index', {
            method: 'POST',
            body: JSON.stringify({
              name: 'idx_foo',
              fields: ['name'],
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

    await t.step(
      'should pass db and body name and fields to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies/_index', {
              method: 'POST',
              body: JSON.stringify({
                name: 'idx_foo',
                fields: ['name'],
              }),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.db, 'movies')
                assertEquals(body.name, 'idx_foo')
                assertEquals(body.fields.length, 1)
                assertEquals(body.fields[0], 'name')
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })

  await t.step('POST /data/:db/_query', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/_query', {
            method: 'POST',
            body: JSON.stringify({
              type: 'movie',
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

    await t.step('should pass db and body to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/_query', {
            method: 'POST',
            body: JSON.stringify({
              type: 'movie',
            }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.db, 'movies')
              assertEquals(body.query, { type: 'movie' })
            })
        )
        .finally(async () => await harness.stop())
    })

    await t.step(
      'should pass db and empty object when there is no body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies/_query', {
              method: 'POST',
              // no body
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.db, 'movies')
                assertEquals(body.query, {})
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })

  await t.step('POST /data/movies/_bulk', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/data/movies/_bulk', {
            method: 'POST',
            body: JSON.stringify([{ id: '1', type: 'movie' }]),
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
      'should pass the db route param and body to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/data/movies/_bulk', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify([{ id: '1', type: 'movie' }]),
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.db, 'movies')
                assertEquals(body.results, [{ id: '1', type: 'movie' }])
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })
})
