const test = require('tape')
const validateConfig = require('./config-schema')

const noop = () => null



test('validate schema', t => {
  t.plan(1)
  try {
    validateConfig({
      app: noop,
      adapters: [
        { port: 'queue', plugins: [noop]}
      ]
    })
    t.ok(true)
  } catch (e) {
    console.log(JSON.stringify(e.issues))
    t.ok(false)
  }
})
