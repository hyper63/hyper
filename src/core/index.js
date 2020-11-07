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
    cache: cacheCore(services),
    data: dataCore(services),
    storage: storageCore(services)
  })
}

