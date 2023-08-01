import type { DataPort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import {
  $logHyperErr,
  $resolveHyperErr,
  Async,
  AsyncReader,
  is,
  triggerEvent,
} from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

const setDescending = <T extends { descending?: boolean }>(arg: T) => ({
  ...arg,
  descending: Boolean(arg.descending),
})

const checkNameIsValid = is<string>(() => true, 'database name is not valid')

/**
 * @param {string} name
 */
export const create = (name: string) =>
  of(name)
    .chain(checkNameIsValid)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.createDatabase(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:CREATE_DB'))

/**
 * @param {string} name
 */
export const remove = (name: string) =>
  of(name)
    .chain(checkNameIsValid)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.removeDatabase(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:DELETE_DB'))

/**
 * @param {string} db
 * @param {object} query
 */
export const query = (
  db: string,
  query: Parameters<DataPort['queryDocuments']>[0]['query'],
) =>
  of({ db, query })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.queryDocuments(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:QUERY'))

/**
 * @param {string} db
 * @param {string} name
 * @param {string[]} fields
 */
export const index = (
  db: string,
  name: string,
  fields: Parameters<DataPort['indexDocuments']>[0]['fields'],
  partialFilter: Parameters<DataPort['indexDocuments']>[0]['partialFilter'],
) =>
  of({ db, name, fields, partialFilter })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.indexDocuments(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:INDEX'))

export const list = (
  db: string,
  options: Omit<Parameters<DataPort['listDocuments']>[0], 'db'>,
) =>
  of({ db, ...options })
    .map(setDescending)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.listDocuments(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:LIST'))

/**
 * @param {string} db
 * @param {object[]} docs
 */
export const bulk = (db: string, docs: Record<string, unknown>[]) =>
  of({ db, docs })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.bulkDocuments(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:BULK'))
