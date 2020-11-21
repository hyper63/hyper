const { identity } = require('ramda')
const adapter = require('./adapter')()

module.exports = function memory(config) {
  return ({
    id: 'fs',
    port: 'storage',
    load: identity,
    link: _ => _ => adapter
  })
}