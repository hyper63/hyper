const { merge } = require('ramda')
const adapter = require('./adapter')

module.exports = function memory(config) {
  return ({
    id: 'pouchdb',
    port: 'data',
    load: merge(config),
    link: ({dir}) => _ => adapter(dir)
  })
}