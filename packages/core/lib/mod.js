import cacheCore from './cache/mod.ts'
import dataCore from './data/mod.ts'
import storageCore from './storage/mod.js'
import searchCore from './search/mod.js'
import hooksCore from './hooks/mod.js'
import queueCore from './queue/mod.js'
import crawlerCore from './crawler/mod.js'

/**
 * main core module
 *
 * this module takes services and environment
 * and passes them to each core module
 */
export default function (services) {
  return Object.freeze({
    cache: services.cache ? cacheCore(services) : null,
    data: services.data ? dataCore(services) : null,
    storage: services.storage ? storageCore(services) : null,
    search: services.search ? searchCore(services) : null,
    queue: services.queue ? queueCore(services) : null,
    crawler: services.crawler ? crawlerCore(services) : null,
    hooks: hooksCore(services),
    events: services.events,
    middleware: services.middleware,
  })
}
