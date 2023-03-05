// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks, express } from '../deps.ts'
import { assert, assertEquals } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { data } from './data.ts'

const services: any = {
  data: {
    getDocument: (db: any, id: any, isLegacyGetEnabled: any) =>
      crocks.Async.Resolved({
        ok: true,
        doc: { _id: id, db, isLegacyGetEnabled },
      }),
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

  // TODO: add more test coverage here
})
