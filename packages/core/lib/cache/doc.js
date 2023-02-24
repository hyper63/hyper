import { crocks, ms, R } from '../../deps.js';
import { apply, is, legacyGet, of, triggerEvent } from '../utils/mod.js';

const { compose, identity, ifElse, isNil, lensProp, prop, over, omit } = R;
const { hasProp } = crocks;

const INVALID_KEY = 'key is not valid';
const INVALID_RESULT = 'result is not valid';
const convertTTL = over(
  lensProp('ttl'),
  (ttl) => (ttl ? String(ms(ttl)) : null),
);
const removeTTL = ifElse(compose(isNil, prop('ttl')), omit(['ttl']), identity);

/**
 * @param {string} store
 * @param {string} key
 * @param {Object} value
 * @param {string} ttl
 * @returns {AsyncReader}
 */
export const create = (store, key, value, ttl) =>
  of({ store, key, value, ttl })
    .map(convertTTL)
    .map(removeTTL)
    .chain(is(validKey, INVALID_KEY))
    .chain(apply('createDoc'))
    .chain(triggerEvent('CACHE:CREATE'))
    .chain(is(validResult, INVALID_RESULT));

/**
 * @param {string} store
 * @param {string} key
 * @returns {AsyncReader}
 */
export const get = (store, key) =>
  of({ store, key })
    .chain(is(validKey, INVALID_KEY))
    .chain(apply('getDoc'))
    .chain(triggerEvent('CACHE:GET'))
    .chain(legacyGet('CACHE:GET'));
// .chain(is(validResult, INVALID_RESULT));

/**
 * @param {string} store
 * @param {string} key
 * @param {Object} value
 * @param {string} ttl
 * @returns {AsyncReader}
 */
export const update = (store, key, value, ttl) =>
  of({ store, key, value, ttl })
    .map(convertTTL)
    .map(removeTTL)
    .chain(is(validKey, INVALID_KEY))
    .chain(apply('updateDoc'))
    .chain(triggerEvent('CACHE:UPDATE'))
    .chain(is(validResult, INVALID_RESULT));
/**
 * @param {string} store
 * @param {string} key
 * @returns {AsyncReader}
 */
export const del = (store, key) =>
  of({ store, key })
    .chain(is(validKey, INVALID_KEY))
    .chain(apply('deleteDoc'))
    .chain(triggerEvent('CACHE:DELETE'))
    .chain(is(validResult, INVALID_RESULT));

// validators predicate functions

function validKey({ key }) {
  /**
   * rules:
   * must begin with lowercase letter
   * rest of the name must be a combination of:
   * lowercase letters
   * digits 0-9
   * or any of these characters - _ $ +
   */
  return /^[a-z]+$/.test(key[0]) && /^[a-z0-9-~_/$/+]+$/.test(key);
}

function validResult(result) {
  if (result && hasProp('ok', result)) {
    return true;
  }
  console.log({ result });
  return false;
}
