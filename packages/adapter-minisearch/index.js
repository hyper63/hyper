const { identity } = require('ramda')
const adapter = require('./adapter')()

module.exports = function memory(config) {
  return ({
    id: 'minisearch',
    port: 'search',
    load: identity,
    link: _ => _ => adapter
  })
}