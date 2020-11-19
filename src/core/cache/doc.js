import ms from 'ms'
import { lensProp, over } from 'ramda'
import { is, of, apply, triggerEvent } from '../utils'
import { hasProp } from 'crocks/predicates'

const INVALID_KEY = "key is not valid";
const INVALID_RESULT = "result is not valid";
const convertTTL = over(lensProp("ttl"), (ttl) => (ttl ? ms(ttl) : null));

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
    .chain(is(validKey, INVALID_KEY))
    .chain(apply("createDoc"))
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
    .chain(apply("getDoc"))
    .chain(triggerEvent('CACHE:GET'))
    .chain(is(validResult, INVALID_RESULT));

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
    .chain(is(validKey, INVALID_KEY))
    .chain(apply("updateDoc"))
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
    .chain(apply("deleteDoc"))
    .chain(triggerEvent('CACHE:DELETE'))
    .chain(is(validResult, INVALID_RESULT));

// validators predicate functions

function validKey(name) {
  return true;
}

function validResult(result) {
  if (result && hasProp("ok", result)) {
    return true;
  }
  console.log({ result });
  return false;
}
