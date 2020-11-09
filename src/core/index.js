import { default as cacheCore } from './cache'
import { default as dataCore } from './data'
import { default as storageCore } from './storage'

/**
 * main core module
 *
 * this module takes services and environment
 * and passes them to each core module
 *
 */
export default function (services) {
  return Object.freeze({
    cache: services.cache ? cacheCore(services) : null,
    data: services.data ? dataCore(services) : null,
    storage: services.storage ? storageCore(services) : null
  })
}

