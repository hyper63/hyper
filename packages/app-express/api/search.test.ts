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
        .finally(async () => await harness.stop())
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
          .finally(async () => await harness.stop())
      },
    )
  })

  // TODO: add more test coverage here
})
