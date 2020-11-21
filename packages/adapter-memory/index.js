const { identity } = require('ramda')
const adapter = require('./adapter')()

module.exports = function memory(config) {
  return ({
    id: 'memory',
    port: 'cache',
    load: identity,
    link: _ => _ => adapter
  })
}