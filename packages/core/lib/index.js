const cacheCore = require('./cache')
const dataCore = require('./data')
const storageCore = require('./storage')
const searchCore = require('./search')
const hooksCore = require('./hooks')
/**
 * main core module
 *
 * this module takes services and environment
 * and passes them to each core module
 *
 */
module.exports = function (services) {
  return Object.freeze({
    cache: services.cache ? cacheCore(services) : null,
    data: services.data ? dataCore(services) : null,
    storage: services.storage ? storageCore(services) : null,
    search: services.search ? searchCore(services) : null,
    hooks: hooksCore(services),
    events: services.events,
    middleware: services.middleware
  })
}

