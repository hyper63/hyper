import { type CachePort, R } from '../../deps.ts'
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
const { toLower } = R

const checkNameIsValid = is((name: string) => {
  // verify that the name does not contains spaces
  // verify that the name does not contain slashes
  // verify that the name contains URI friendly characters
  // cache names should only start with alphanumeric characters
  // should return a true or false
  return /^[a-z0-9]+$/.test(name[0]) && /^[a-z0-9-~_]+$/.test(name)
}, { status: 422, msg: 'name is not valid' })

export const index = () =>
  ask(({ svc }: ReaderEnvironment<CachePort>) => {
    return Async.of(undefined)
      .chain(Async.fromPromise((input) => svc.index(input)))
      .bichain($resolveHyperErr, $logHyperErr)
  })
    .chain(lift)
    .chain(triggerEvent('CACHE:INDEX'))

/**
 * @param {string} name
 */
export const create = (name: string) =>
  of(name)
    .map(toLower)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CachePort>) => {
        return Async.of(input)
          .chain(checkNameIsValid)
          .chain(Async.fromPromise((input) => svc.createStore(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CACHE:CREATE_STORE'))

/**
 * @param {string} name
 */
export const del = (name: string) =>
  of(name)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CachePort>) => {
        return Async.of(input)
          .chain(checkNameIsValid)
          .chain(Async.fromPromise((input) => svc.destroyStore(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CACHE:DELETE_STORE'))

/**
 * @param {string} name
 * @param {string} pattern
 */
export const query = (name: string, pattern: string) =>
  of({ store: name, pattern })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CachePort>) => {
        return Async.of(input)
          .chain(({ store }) => checkNameIsValid(store))
          .map(() => input)
          .chain(Async.fromPromise((input) => svc.listDocs(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CACHE:LIST'))
