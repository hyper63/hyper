const ms = require('ms')
const { compose, identity, ifElse, isNil, lensProp, prop, over, omit } = require('ramda')
const { is, of, apply, triggerEvent } = require('../utils')
const { hasProp } = require('crocks/predicates')

const INVALID_KEY = "key is not valid";
const INVALID_RESULT = "result is not valid";
const convertTTL = over(lensProp("ttl"), (ttl) => (ttl ? String(ms(ttl)) : null));
const removeTTL = ifElse(compose(isNil, prop('ttl')), omit(['ttl']), identity)


/**
 * @param {string} store
 * @param {string} key
 * @param {Object} value
 * @param {string} ttl
 * @returns {AsyncReader}
 */
const create = (store, key, value, ttl) =>
  of({ store, key, value, ttl })
    .map(convertTTL)
    .map(removeTTL)
    .chain(is(validKey, INVALID_KEY))
    .chain(apply("createDoc"))
    .chain(triggerEvent('CACHE:CREATE'))
    .chain(is(validResult, INVALID_RESULT));

/**
 * @param {string} store
 * @param {string} key
 * @returns {AsyncReader}
 */
const get = (store, key) =>
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
const update = (store, key, value, ttl) =>
  of({ store, key, value, ttl })
    .map(convertTTL)
    .chain(is(validKey, INVALID_KEY))
    .map(v => (console.log('UPDATE', v), v))
    .chain(apply("updateDoc"))
    .map(v => (console.log('UPDATE', v), v))
    .chain(triggerEvent('CACHE:UPDATE'))
    .chain(is(validResult, INVALID_RESULT));

/**
 * @param {string} store
 * @param {string} key
 * @returns {AsyncReader}
 */
const del = (store, key) =>
  of({ store, key })
    .chain(is(validKey, INVALID_KEY))
    .chain(apply("deleteDoc"))
    .chain(triggerEvent('CACHE:DELETE'))
    .chain(is(validResult, INVALID_RESULT));

module.exports = {
  create,
  get,
  update,
  del
}
// validators predicate functions

function validKey(doc) {
  return /^[a-z0-9-]+$/.test(doc.key);
}

function validResult(result) {
  if (result && hasProp("ok", result)) {
    return true;
  }
  console.log({ result });
  return false;
}
