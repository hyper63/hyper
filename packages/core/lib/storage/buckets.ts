import type { StoragePort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import { $logHyperErr, $resolveHyperErr, Async, AsyncReader, triggerEvent } from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

/**
 * @param {string} name
 */
export const make = (name: string) =>
  of(name)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<StoragePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.makeBucket(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('STORAGE:CREATE_BUCKET'))

/**
 * @param {string} name
 */
export const remove = (name: string) =>
  of(name)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<StoragePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.removeBucket(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('STORAGE:DELETE_BUCKET'))

export const list = () =>
  ask(({ svc }: ReaderEnvironment<StoragePort>) => {
    return Async.of(undefined)
      .chain(Async.fromPromise((input) => svc.listBuckets(input)))
      .bichain($resolveHyperErr, $logHyperErr)
  })
    .chain(lift)
    .chain(triggerEvent('STORAGE:LIST_BUCKETS'))
