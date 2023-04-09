import { type CachePort, ms, R } from '../../deps.ts'
import { apply, is, legacyGet, of, triggerEvent } from '../utils/mod.ts'

const { compose, identity, ifElse, isNil, prop, omit } = R

const convertTTL = (arg: { ttl?: string } = {}) => ({
  ...arg,
  ttl: arg.ttl ? String(ms(arg.ttl)) : null,
})
const removeTTL = ifElse(compose(isNil, prop('ttl')), omit(['ttl']), identity)

const checkKeyIsValid = is(({ key }: { key: string }) => {
  /**
   * rules:
   * must begin with lowercase letter
   * rest of the name must be a combination of:
   * lowercase letters
   * digits 0-9
   * or any of these characters - _ $ +
   */
  return /^[a-z]+$/.test(key[0]) && /^[a-z0-9-~_/$/+]+$/.test(key)
}, 'key is not valid')

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
    .map(convertTTL)
    .map(removeTTL)
    .chain(checkKeyIsValid)
    .chain(apply<CachePort, 'createDoc'>('createDoc'))
    .chain(triggerEvent('CACHE:CREATE'))

/**
 * @param {string} store
 * @param {string} key
 */
export const get = (store: string, key: string) =>
  of({ store, key })
    .chain(checkKeyIsValid)
    .chain(apply<CachePort, 'getDoc'>('getDoc'))
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
    .map(convertTTL)
    .map(removeTTL)
    .chain(checkKeyIsValid)
    .chain(apply<CachePort, 'updateDoc'>('updateDoc'))
    .chain(triggerEvent('CACHE:UPDATE'))

/**
 * @param {string} store
 * @param {string} key
 */
export const del = (store: string, key: string) =>
  of({ store, key })
    .chain(checkKeyIsValid)
    .chain(apply<CachePort, 'deleteDoc'>('deleteDoc'))
    .chain(triggerEvent('CACHE:DELETE'))
