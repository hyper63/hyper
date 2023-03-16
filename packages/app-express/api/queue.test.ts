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
        .finally(async () => await harness.stop())
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
        .finally(async () => await harness.stop())
    })
  })

  // TODO: add more test coverage here
})
