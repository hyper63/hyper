// deno-lint-ignore-file no-unused-vars
import { cache, data, hooks, queue, search, storage, crawler } from "./deps.js";

export default function (adapters) {
  return ({
    cache: adapters.cache ? cache(adapters.cache) : null,
    data: adapters.data ? data(adapters.data) : null,
    storage: adapters.storage ? storage(adapters.storage) : null,
    search: adapters.search ? search(adapters.search) : null,
    queue: adapters.queue ? queue(adapters.queue) : null,
    crawler: adapters.crawler ? crawler(adapters.crawler) : null,
    hooks: adapters.hooks,
  });
}
