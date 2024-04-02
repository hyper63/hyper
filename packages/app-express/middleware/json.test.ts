import { express } from '../deps.ts'
import { assertObjectMatch } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { json } from './json.ts'

const app = express()
app.post('/foo/bar', json(), (req, res) => {
  res.json(req.body)
})

Deno.test('json', async (t) => {
  const harness = createHarness(app)

  await t.step('should parse if application/json content-type', async () => {
    await harness
      .start()
      .then(() =>
        harness('/foo/bar', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: '1', type: 'movie' }),
        })
          .then((res) => res.json())
          .then((body) => {
            assertObjectMatch(body, { id: '1', type: 'movie' })
          })
      )
      .then(() => harness.stop())
      .catch(() => harness.stop())
  })

  await t.step(
    'should default parsing if no content-type is specified',
    async () => {
      await harness
        .start()
        .then(() =>
          harness('/foo/bar', {
            method: 'POST',
            body: JSON.stringify({ id: '1', type: 'movie' }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertObjectMatch(body, { id: '1', type: 'movie' })
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    },
  )

  await t.step('should respect the provided type', async (t) => {
    const app = express()
    app.post('/foo/bar', json({ type: 'foo/bar' }), (req, res) => {
      res.json(req.body)
    })
    const harness = createHarness(app)

    await t.step('should parse as json', async () => {
      await harness
        .start()
        .then(() =>
          harness('/foo/bar', {
            method: 'POST',
            headers: { 'content-type': 'foo/bar' },
            body: JSON.stringify({ id: '1', type: 'movie' }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertObjectMatch(body, { id: '1', type: 'movie' })
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })

    await t.step('should parse as json', async () => {
      await harness
        .start()
        .then(() =>
          harness('/foo/bar', {
            method: 'POST',
            body: JSON.stringify({ id: '1', type: 'movie' }),
          })
            .then((res) => res.json())
            .then((body) => {
              assertObjectMatch({}, body)
            })
        )
        .then(() => harness.stop())
        .catch(() => harness.stop())
    })
  })
})
