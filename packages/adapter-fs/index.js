const { merge } = require('ramda')
const adapter = require('./adapter')

module.exports = function (config) {
  return ({
    id: 'fs',
    port: 'storage',
    load: merge(config),
    link: ({dir}) => _ => adapter(dir)
  })
}