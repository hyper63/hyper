#!/usr/bin/env node
const start = require('./index')
const stop = require('./stop')
const args = process.argv.splice(2)

if (args[0] === 'stop') {
  stop()
} else {
  start()
}
