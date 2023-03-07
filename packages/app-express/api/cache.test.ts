// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks, express } from '../deps.ts'
import { assertEquals } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { cache } from './cache.ts'

const services: any = {
  cache: {
    getDoc: (name: any, key: any, isLegacyGetEnabled: any) =>
      crocks.Async.Resolved({
        ok: true,
        doc: { _id: key, name, isLegacyGetEnabled },
      }),
  },
  middleware: [],
}

// @ts-ignore
const app = cache(services)(express())

Deno.test('cache', async (t) => {
  const harness = createHarness(app)

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

  // TODO: add more test coverage here
})
