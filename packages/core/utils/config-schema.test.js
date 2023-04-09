import { assertEquals } from '../dev_deps.ts'

import validateConfig from './config-schema.ts'

const noop = () => null
const plugin = () => ({ id: 'foo', load: noop, link: noop })

Deno.test('config-schema', async (t) => {
  await t.step('validate schema', () => {
    try {
      validateConfig({
        app: noop,
        adapters: [
          { port: 'queue', plugins: [plugin()] },
          { port: 'crawler', plugins: [plugin()] },
        ],
      })
      assertEquals(true, true)
    } catch (e) {
      console.log(JSON.stringify(e.issues))
      assertEquals(true, false)
    }
  })
})
