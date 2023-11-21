// @deno-types="npm:@types/ramda@^0.29.9"
export * as R from 'npm:ramda@0.29.1'

/**
 * Shim hand-rolled crocks types
 */
// @deno-types="./crocks.d.ts"
export { default as crocks } from 'npm:crocks@0.12.4'
export { z } from 'https://deno.land/x/zod@v3.20.5/mod.ts'
export { ms } from 'https://deno.land/x/ms@v0.1.0/ms.ts'

export { cuid } from 'https://deno.land/x/cuid@v1.0.0/index.js'
export { join } from 'https://deno.land/std@0.207.0/path/mod.ts'
export { exists } from 'https://deno.land/std@0.207.0/fs/mod.ts'

import {
  HyperErr,
  isBaseHyperErr,
  isHyperErr as isHyperErrBase,
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-utils%40v0.1.2/packages/utils/hyper-err.js'

export { HyperErr, isBaseHyperErr }

/**
 * The new ramda types in hyper-utils are overly assuming, so
 * just wrap the isHyperErr from utils with a more unassuming signature
 */
// deno-lint-ignore no-explicit-any
export const isHyperErr = (v: any) => isHyperErrBase(v)

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
} from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-port-data%40v2.3.0/packages/port-data/mod.ts'
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
