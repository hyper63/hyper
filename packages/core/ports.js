// deno-lint-ignore-file no-unused-vars
import { queue } from "../port-queue/mod.js";
import { cache } from "../port-cache/mod.js";
import { data } from "../port-data/mod.js";
import { storage } from "../port-storage/mod.js";
import { search } from "../port-search/mod.js";
import { hooks } from "../port-hooks/mod.js";

export default function (adapters) {
  return ({
    cache: adapters.cache ? cache(adapters.cache) : null,
    data: adapters.data ? data(adapters.data) : null,
    storage: adapters.storage ? storage(adapters.storage) : null,
    search: adapters.search ? search(adapters.search) : null,
    queue: adapters.queue ? queue(adapters.queue) : null,
    hooks: adapters.hooks,
  });
}
