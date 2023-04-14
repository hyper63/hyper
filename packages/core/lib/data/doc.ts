import { cuid, type DataPort, R } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import {
  $logHyperErr,
  $resolveHyperErr,
  Async,
  AsyncReader,
  legacyGet,
  triggerEvent,
} from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

const { defaultTo } = R

/**
 * @param {string} db
 * @param {object} doc
 */
export const create = (db: string, doc: Record<string, unknown>) =>
  of(doc)
    .map<{ _id?: string }>(defaultTo({}))
    /**
     * Generate _id if not defined on document
     */
    .map((doc) => ({ db, id: doc._id || cuid(), doc }))
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.createDocument(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:CREATE'))

/**
 * @param {string} db
 * @param {string} id
 */
export const get = (db: string, id: string) =>
  of({ db, id })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.retrieveDocument(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:GET'))
    .chain(legacyGet('DATA:GET'))

export const update = (db: string, id: string, doc: Record<string, unknown>) =>
  of({ db, id, doc })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.updateDocument(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:UPDATE'))

export const remove = (db: string, id: string) =>
  of({ db, id })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<DataPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.removeDocument(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('DATA:DELETE'))
