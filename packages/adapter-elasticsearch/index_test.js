const test = require('tape')
const searchAdapter = require('./index')

// TODO: fix this broken require
const schema = require('../../utils/plugin-schema')

test('validate adapter', t => {
  t.plan(1)
  try {
    const result = schema(searchAdapter())
    t.ok(true)
  } catch (e) {
    console.log(e)
    t.ok(false)
  }
})