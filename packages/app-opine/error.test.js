
import { assertEquals, superdeno } from './dev_deps.js'

import build from './mod.js'

// TODO: Tyler. Probably better way to do this
Deno.env.set('DENO_ENV', 'test')

const app = build({
  middleware: [],
})

Deno.test('GET /error', async () => {
  const res = await superdeno(app)
    .get('/error')

  assertEquals(res.body.ok, false)
})
