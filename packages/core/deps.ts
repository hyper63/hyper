// @deno-types="npm:@types/ramda@^0.29.9"
export * as R from 'ramda'

/**
 * Shim hand-rolled crocks types
 */
// @deno-types="./crocks.d.ts"
export { default as crocks } from 'crocks'
export { z } from 'zod'
export { default as ms } from 'ms'
export { default as cuid } from 'cuid'
export { join } from '@std/path'
export { exists } from '@std/fs'

import { HyperErr, isBaseHyperErr, isHyperErr as isHyperErrBase } from '@hyper63/utils'

export { HyperErr, isBaseHyperErr }

/**
 * The new ramda types in hyper-utils are overly assuming, so
 * just wrap the isHyperErr from utils with a more unassuming signature
 */
// deno-lint-ignore no-explicit-any
export const isHyperErr = (v: any) => isHyperErrBase(v)

export { queue, type QueuePort } from '@hyper63/port-queue'
export { cache, type CachePort } from '@hyper63/port-cache'
export { data, type DataPort } from '@hyper63/port-data'
export { storage, type StoragePort } from '@hyper63/port-storage'
export { search, type SearchPort } from '@hyper63/port-search'
export { crawler, type CrawlerPort } from '@hyper63/port-crawler'

import { hooks } from '@hyper63/port-hooks'
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
