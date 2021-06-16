
// TODO: Tyler. Probably better way to do this
import { assertEquals, superdeno } from '../dev_deps.js'

import build from '../mod.js'

Deno.env.set('DENO_ENV', 'test')

const app = build({
  middleware: []
})

Deno.test('GET /error', async () => {
  const res = await superdeno(app)
    .get('/error')

  assertEquals(res.body.ok, false)
})
