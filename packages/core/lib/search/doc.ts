import type { SearchPort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import { $logHyperErr, $resolveHyperErr, Async, AsyncReader, triggerEvent } from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

/**
 * @param {string} index
 * @param {string} key
 * @param {object} doc
 */
export const indexDoc = (
  index: string,
  key: string,
  doc: Record<string, unknown>,
) =>
  of({ index, key, doc })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.indexDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:CREATE'))

/**
 * @param {string} index
 * @param {string} key
 */
export const getDoc = (index: string, key: string) =>
  of({ index, key })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.getDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:GET'))

/**
 * @param {string} index
 * @param {string} key
 * @param {object} doc
 */
export const updateDoc = (
  index: string,
  key: string,
  doc: Record<string, unknown>,
) =>
  of({ index, key, doc })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.updateDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:UPDATE'))

/**
 * @param {string} index
 * @param {string} key
 */
export const removeDoc = (index: string, key: string) =>
  of({ index, key })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.removeDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:DELETE'))
