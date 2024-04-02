import { type CachePort, ms, R } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import {
  $logHyperErr,
  $resolveHyperErr,
  Async,
  AsyncReader,
  is,
  legacyGet,
  triggerEvent,
} from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader
const { isNil, omit } = R

const convertTTL = <T extends { ttl?: string }>(arg: T) => ({
  ...arg,
  ttl: arg.ttl ? String(ms(arg.ttl)) : null,
})
const removeTTL = <T extends { ttl?: string }>(arg: T) => {
  if (isNil(arg.ttl)) {
    return omit(['ttl'], arg)
  }
  return arg
}

function checkKeyIsValid<T extends { key: string }>(input: T) {
  return is<T>(({ key }) => {
    /**
     * rules:
     * must begin with lowercase letter
     * rest of the name must be a combination of:
     * lowercase letters
     * digits 0-9
     * or any of these characters - _ $ +
     */
    return /^[a-z]+$/.test(key[0]) && /^[a-z0-9-~_/$/+]+$/.test(key)
  }, { status: 422, msg: 'key is not valid' })(input)
}

/**
 * @param {string} store
 * @param {string} key
 * @param {object} value
 * @param {string} [ttl]
 */
export const create = (
  store: string,
  key: string,
  value: Record<string, unknown>,
  ttl?: string,
) =>
  of({ store, key, value, ttl })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CachePort>) => {
        return Async.of(input)
          .map(convertTTL)
          .map(removeTTL)
          .chain(checkKeyIsValid)
          .chain(Async.fromPromise((input) => svc.createDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CACHE:CREATE'))

/**
 * @param {string} store
 * @param {string} key
 */
export const get = (store: string, key: string) =>
  of({ store, key })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CachePort>) => {
        return Async.of(input)
          .chain(checkKeyIsValid)
          .chain(Async.fromPromise((input) => svc.getDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CACHE:GET'))
    .chain(legacyGet('CACHE:GET'))

/**
 * @param {string} store
 * @param {string} key
 * @param {object} value
 * @param {string} [ttl]
 */
export const update = (
  store: string,
  key: string,
  value: Record<string, unknown>,
  ttl?: string,
) =>
  of({ store, key, value, ttl })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CachePort>) => {
        return Async.of(input)
          .map(convertTTL)
          .map(removeTTL)
          .chain(checkKeyIsValid)
          .chain(Async.fromPromise((input) => svc.updateDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CACHE:UPDATE'))

/**
 * @param {string} store
 * @param {string} key
 */
export const del = (store: string, key: string) =>
  of({ store, key })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CachePort>) => {
        return Async.of(input)
          .chain(checkKeyIsValid)
          .chain(Async.fromPromise((input) => svc.deleteDoc(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CACHE:DELETE'))
