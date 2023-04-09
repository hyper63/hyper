// deno-lint-ignore-file no-unused-vars
import { cache, crawler, data, hooks, queue, search, storage } from './deps.ts'

// deno-lint-ignore no-explicit-any
export function parseHyperServices(adapters: any) {
  return {
    cache: adapters.cache ? cache(adapters.cache) : null,
    data: adapters.data ? data(adapters.data) : null,
    storage: adapters.storage ? storage(adapters.storage) : null,
    search: adapters.search ? search(adapters.search) : null,
    queue: adapters.queue ? queue(adapters.queue) : null,
    crawler: adapters.crawler ? crawler(adapters.crawler) : null,
    hooks: adapters.hooks,
  }
}
