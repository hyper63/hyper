
// TODO: Tyler. Probably better way to do this
import { crocks } from '../deps.js'
import { assertEquals, superdeno } from '../dev_deps.js'

import build from '../mod.js'

Deno.env.set('DENO_ENV', 'test')

const app = build({
  data: {
    bulkDocuments: () => crocks.Async.Resolved({ ok: true, results: [] })
  },
  middleware: []
})

Deno.test('POST /data/movies/_bulk', async () => {
  const res = await superdeno(app)
    .post('/data/movies/_bulk')
    .set('Content-Type', 'application/json')
    .send([{ id: '1', type: 'movie' }])

  assertEquals(res.body.ok, true)
})
