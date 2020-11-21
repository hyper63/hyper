const { identity } = require('ramda')
const adapter = require('./adapter')()

module.exports = function memory(config) {
  return ({
    id: 'pouchdb',
    port: 'data',
    load: identity,
    link: _ => _ => adapter
  })
}