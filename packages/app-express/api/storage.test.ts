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
    getObject: (_name: any, object: any, useSignedUrl: boolean) => {
      if (object === 'not_found') {
        return crocks.Async.Resolved({
          ok: false,
          msg: 'not found',
          status: 404,
        })
      }
      if (useSignedUrl) {
        return crocks.Async.Resolved({ ok: true, url: 'https://foo.bar' })
      }

      return crocks.Async.Resolved(
        new Response('Some awesome object content').body,
      )
    },
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

  await t.step('GET /storage/:name/*', async (t) => {
    await t.step('Object', async (t) => {
      await t.step(
        'should set the Content-Type header according to the extension on the url',
        async () => {
          await harness
            .start()
            .then(() =>
              harness('/storage/movies/foo/bar.txt', {
                method: 'GET',
              }).then((res) => {
                assertEquals(
                  res.headers.get('content-type'),
                  'text/plain; charset=UTF-8',
                )
                return res.body?.cancel()
              })
            )
            .finally(async () => await harness.stop())
        },
      )

      await t.step(
        'should default to application/octet-stream if no mime-type can be derived from the url',
        async () => {
          await harness
            .start()
            .then(() =>
              harness('/storage/movies/foo/bar', {
                method: 'GET',
              }).then((res) => {
                assertEquals(
                  res.headers.get('content-type'),
                  'application/octet-stream',
                )
                return res.body?.cancel()
              })
            )
            .finally(async () => await harness.stop())
        },
      )

      await t.step('should stream the data from core', async () => {
        // no extension
        await harness
          .start()
          .then(() =>
            harness('/storage/movies/foo/bar', {
              method: 'GET',
            })
              .then((res) => res.text())
              .then((body) => {
                assertEquals(body, 'Some awesome object content')
              })
          )
          .finally(async () => await harness.stop())

        // with extension
        await harness
          .start()
          .then(() =>
            harness('/storage/movies/foo/bar.txt', {
              method: 'GET',
            })
              .then((res) => res.text())
              .then((body) => {
                assertEquals(body, 'Some awesome object content')
              })
          )
          .finally(async () => await harness.stop())
      })
    })

    await t.step('JSON', async (t) => {
      await t.step(
        'should return JSON if a HyperErr comes back from core',
        async () => {
          await harness
            .start()
            .then(() =>
              harness('/storage/movies/not_found', {
                method: 'GET',
              }).then((res) => {
                assertEquals(
                  res.headers.get('content-type'),
                  'application/json; charset=utf-8',
                )
                return res.body?.cancel()
              })
            )
            .finally(async () => await harness.stop())
        },
      )

      await t.step(
        'should set the status to the status in the HyperErr that comes back from core',
        async () =>
          await harness
            .start()
            .then(() =>
              harness('/storage/movies/not_found', {
                method: 'GET',
              }).then((res) => {
                assertEquals(res.status, 404)
                return res.body?.cancel()
              })
            )
            .finally(async () => await harness.stop()),
      )
    })
  })

  // TODO: add more test coverage here
})
