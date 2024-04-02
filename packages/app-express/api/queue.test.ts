// deno-lint-ignore-file ban-ts-comment no-explicit-any
import { crocks, express } from '../deps.ts'
import { assertEquals, assertObjectMatch } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { queue } from './queue.ts'

const services: any = {
  queue: {
    create: (arg: any) =>
      crocks.Async.Resolved({
        ok: true,
        arg,
      }),
    delete: (arg: any) =>
      crocks.Async.Resolved({
        ok: true,
        arg,
      }),
    post: (arg: any) =>
      crocks.Async.Resolved({
        ok: true,
        arg,
      }),
    list: (arg: any) =>
      crocks.Async.Resolved({
        ok: true,
        arg,
      }),
    cancel: (arg: any) =>
      crocks.Async.Resolved({
        ok: true,
        arg,
      }),
  },
}

// @ts-ignore
const app = queue(services)(express())

Deno.test('queue', async (t) => {
  const harness = createHarness(app)

  await t.step('PUT /queue/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies', {
            method: 'PUT',
            body: JSON.stringify({
              target: 'https://foo.bar',
              secret: 'supersecret',
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

    await t.step('should pass name route params and body to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies', {
            method: 'PUT',
            body: JSON.stringify({
              target: 'https://foo.bar',
              secret: 'supersecret',
            }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertObjectMatch(body.arg, {
                name: 'movies',
                target: 'https://foo.bar',
                secret: 'supersecret',
              })
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })
  })

  await t.step('DELETE /queue/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies', {
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

    await t.step('should pass name route param to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies', {
            method: 'DELETE',
          })
            .then((res) => res.json())
            .then((body) => {
              assertEquals(body.arg, 'movies')
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })
  })

  await t.step('POST /queue/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies', {
            method: 'POST',
            body: JSON.stringify({
              type: 'foo',
              id: '1',
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

    await t.step('should pass name route params and body to core', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies', {
            method: 'POST',
            body: JSON.stringify({
              type: 'foo',
              id: '1',
            }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertObjectMatch(body.arg, {
                name: 'movies',
                job: {
                  type: 'foo',
                  id: '1',
                },
              })
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })
  })

  await t.step('GET /queue/:name', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies?status=READY').then((res) => {
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
      'should pass name route params and status query to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/queue/movies?status=READY')
              .then((res) => res.json())
              .then((body) => {
                assertObjectMatch(body.arg, {
                  name: 'movies',
                  status: 'READY',
                })
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })

  await t.step('POST /queue/:name/:id/_cancel', async (t) => {
    await t.step('should set the content-type header', async () => {
      await harness
        .start()
        .then(() =>
          harness('/queue/movies/1/_cancel', { method: 'POST' }).then((res) => {
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
      'should pass name route params and status query to core',
      async () => {
        await harness
          .start()
          .then(() =>
            harness('/queue/movies/1/_cancel', { method: 'POST' })
              .then((res) => res.json())
              .then((body) => {
                assertObjectMatch(body.arg, {
                  name: 'movies',
                  id: '1',
                })
              })
          )
          .then(() => harness.stop())
          .catch(() => harness.stop())
      },
    )
  })
})
