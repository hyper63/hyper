import validateConfig from './config-schema.js'
import { assertEquals } from '../dev_deps.ts'

const test = Deno.test

const noop = () => null
const plugin = () => ({ id: 'foo', load: noop, link: noop })

test('validate schema', () => {
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
