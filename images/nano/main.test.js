import { assertEquals } from 'https://deno.land/std@0.207.0/assert/mod.ts'
import { main } from './main.js'
import { createHarness } from './test-utils.js'

Deno.test({
  name: 'GET /',
  async fn() {
    const app = await main({
      middleware: [
        (app) => app.get('/foobar', (_req, res) => res.json({ ok: true })),
      ],
    })

    const harness = createHarness(app)

    await harness.start()
      .then(() =>
        harness('/', { method: 'GET' }).then((res) => {
          assertEquals(res.status, 200)
          assertEquals(
            res.headers.get('content-type'),
            'application/json; charset=utf-8',
          )
          return res.body?.cancel()
        })
      )
      .then(() =>
        harness('/foobar', { method: 'GET' }).then((res) => {
          assertEquals(res.status, 200)
          assertEquals(
            res.headers.get('content-type'),
            'application/json; charset=utf-8',
          )
          return res.body?.cancel()
        })
      )
      .finally(async () => await harness.stop())
  },
  sanitizeResources: false,
  sanitizeOps: false,
})
