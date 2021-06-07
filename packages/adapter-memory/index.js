const { identity } = require('ramda')
const adapter = require('./adapter')

/**
 * hyper63 memory plugin adapter
 *
 * This memory plugin for the cache root is an adapter
 * that just uses a JS Map to store documents in memory.
 */
module.exports = function memory (config) {
  return ({
    id: 'memory',
    port: 'cache',
    load: identity,
    link: _ => _ => adapter()
  })
}
