import { express } from '../deps.ts'
import { assert } from '../dev_deps.ts'
import { createHarness } from '../test-utils.ts'

import { legacyGet } from './legacyGet.ts'

const app = express()
app.get('/foo/bar', legacyGet, (req, res) => {
  res.json({ isLegacyGetEnabled: req.isLegacyGetEnabled })
})

Deno.test('legacyGet', async (t) => {
  const harness = createHarness(app)

  await t.step('should set isLegacyGetEnabled to true', async () => {
    await harness.start()
    const on = await harness('/foo/bar', {
      headers: { 'x-hyper-legacy-get': 'true' },
    }).then((res) => res.json())
    assert(on.isLegacyGetEnabled)
    await harness.stop()
  })

  await t.step('should set isLegacyGetEnabled to false', async () => {
    await harness.start()
    const off = await harness('/foo/bar', {
      headers: { 'x-hyper-legacy-get': 'false' },
    }).then((res) => res.json())
    assert(!off.isLegacyGetEnabled)
    await harness.stop()
  })

  await t.step(
    'should not set isLegacyGetEnabled if header is not provided',
    async () => {
      await harness.start()
      const on = await harness('/foo/bar').then((res) => res.json())
      assert(on.isLegacyGetEnabled === undefined)
      await harness.stop()
    },
  )
})
