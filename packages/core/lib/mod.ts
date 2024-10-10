import type {
  CachePort,
  CrawlerPort,
  DataPort,
  HooksPort,
  QueuePort,
  SearchPort,
  StoragePort,
} from '../deps.ts'
import type { HyperServices } from '../types.ts'

import cacheCore from './cache/mod.ts'
import dataCore from './data/mod.ts'
import storageCore from './storage/mod.ts'
import searchCore from './search/mod.ts'
import hooksCore from './hooks/mod.ts'
import queueCore from './queue/mod.ts'
import crawlerCore from './crawler/mod.ts'

/**
 * main core module
 *
 * this module takes services and environment
 * and passes them to each core module
 */
export default function (services: HyperServices) {
  type NonNullService<
    K extends keyof HyperServices,
    V extends HyperServices[K],
  > = HyperServices & { [k in K]: V }

  return Object.freeze({
    cache: services.cache ? cacheCore(services as NonNullService<'cache', CachePort>) : null,
    data: services.data ? dataCore(services as NonNullService<'data', DataPort>) : null,
    storage: services.storage
      ? storageCore(services as NonNullService<'storage', StoragePort>)
      : null,
    search: services.search ? searchCore(services as NonNullService<'search', SearchPort>) : null,
    queue: services.queue ? queueCore(services as NonNullService<'queue', QueuePort>) : null,
    crawler: services.crawler
      ? crawlerCore(services as NonNullService<'crawler', CrawlerPort>)
      : null,
    hooks: hooksCore(services as NonNullService<'hooks', HooksPort>),
    events: services.events,
    middleware: services.middleware,
  })
}
