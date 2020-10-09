const ms = require("ms");
const { lensProp, over } = require("ramda");
const { is, of, apply } = require("../utils");
const hasProp = require("crocks/predicates/hasProp");
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
const create = (store, key, value, ttl) =>
  of({ store, key, value, ttl })
    .map(convertTTL)
    .chain(is(validKey, INVALID_KEY))
    .chain(apply("createDoc"))
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
    .chain(apply("updateDoc"))
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
    .chain(is(validResult, INVALID_RESULT));

module.exports = {
  create,
  get,
  update,
  delete: del,
};

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
