export * as R from 'https://cdn.skypack.dev/ramda@0.28.0?dts'

/**
 * Shim hand-rolled crocks types
 */
// @deno-types="./crocks.d.ts"
export { default as crocks } from 'https://cdn.skypack.dev/crocks@0.12.4'
export { z } from 'https://deno.land/x/zod@v3.20.5/mod.ts'
export { ms } from 'https://deno.land/x/ms@v0.1.0/ms.ts'

export { cuid } from 'https://deno.land/x/cuid@v1.0.0/index.js'
export { join } from 'https://deno.land/std@0.182.0/path/mod.ts'
export { exists } from 'https://deno.land/std@0.182.0/fs/mod.ts'

export {
  HyperErr,
  isBaseHyperErr,
  isHyperErr,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-utils%40v0.1.0/packages/utils/hyper-err.js'

export {
  queue,
  type QueuePort,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-queue%40v0.3.0/packages/port-queue/mod.ts'
export {
  cache,
  type CachePort,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-cache%40v2.0.0/packages/port-cache/mod.ts'
export {
  data,
  type DataPort,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-data%40v2.0.1/packages/port-data/mod.ts'
export {
  storage,
  type StoragePort,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-storage%40v2.0.1/packages/port-storage/mod.ts'
export {
  search,
  type SearchPort,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-search%40v2.0.0/packages/port-search/mod.ts'
export {
  crawler,
  type CrawlerPort,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-crawler%40v0.1.0/packages/port-crawler/mod.ts'

import { hooks } from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-hooks%40v2.0.0/packages/port-hooks/mod.ts'
export { hooks }

/**
 * This type isn't defined in the hooks port,
 * and it's not really being used right now,
 *
 * So we will stub it here for now, until the hooks port
 * defines and exports it
 */
export type HooksPort = ReturnType<typeof hooks> & {
  call: (action: {
    type: string
    payload: Record<string, unknown>
  }) => Promise<void>
}
