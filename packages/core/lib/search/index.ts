import type { SearchPort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import { $logHyperErr, $resolveHyperErr, Async, AsyncReader, triggerEvent } from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

/**
 * @param {string} index
 * @param mappings
 */
export const createIndex = (
  index: string,
  mappings: Parameters<SearchPort['createIndex']>[0]['mappings'],
) =>
  of({ index, mappings })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.createIndex(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:CREATE_INDEX'))

/**
 * @param {string} index
 */
export const deleteIndex = (index: string) =>
  of(index)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.deleteIndex(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:DELETE_INDEX'))

/**
 * @param {string} index
 * @param {object[]} docs
 */
export const bulk = (index: string, docs: Record<string, unknown>[]) =>
  of({ index, docs })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.bulk(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:BULK'))

/**
 * @param {string} index
 * @param {object} q
 */
export const query = (
  index: string,
  q: Parameters<SearchPort['query']>[0]['q'],
) =>
  of({ index, q })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<SearchPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.query(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('SEARCH:QUERY'))
