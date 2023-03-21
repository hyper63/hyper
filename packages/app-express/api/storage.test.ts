// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks, express } from '../deps.ts'
import { assertEquals } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { storage } from './storage.ts'

const services: any = {
  storage: {
    makeBucket: (name: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
      }),
    removeBucket: (name: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
      }),
    removeObject: (name: any, object: any) =>
      crocks.Async.Resolved({
        ok: true,
        name,
        object,
      }),
  },
}

// @ts-ignore
const app = storage(services)(express())

Deno.test('storage', async (t) => {
  const harness = createHarness(app)

  await t.step('PUT /storage/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/storage/movies', {
            method: 'PUT',
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

    await t.step('should pass name route param to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/storage/movies', {
            method: 'PUT',
          })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.name, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('DELETE /storage/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/storage/movies', {
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

    await t.step('should pass name route param to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/storage/movies', {
            method: 'DELETE',
          })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.name, 'movies')
            })
        )
        .finally(async () => await harness.stop())
    })
  })

  await t.step('DELETE /storage/:name/*', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/storage/movies/foo/bar.png', {
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
      'should pass name and object route params to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/storage/movies/foo/bar.png', {
              method: 'DELETE',
            })
              .then((res) => res.json())
              .then((body) => {
                assertEquals(body.name, 'movies')
                assertEquals(body.object, 'foo/bar.png')
              })
          )
          .finally(async () => await harness.stop())
      },
    )
  })

  // TODO: add more test coverage here
})
