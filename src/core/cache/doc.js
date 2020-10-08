const ms = require("ms");
const { lensProp, over } = require("ramda");
const { is, of, apply } = require("../utils");
const hasProp = require("crocks/predicates/hasProp");
const INVALID_KEY = "key is not valid";
const INVALID_RESULT = "result is not valid";
const convertTTL = over(lensProp("ttl"), (ttl) =>
  ttl ? ms(ttl) / 1000 : null
);

module.exports = {
  create: (store, key, value, ttl) =>
    of({ store, key, value, ttl })
      .map(convertTTL)
      .chain(is(validKey, INVALID_KEY))
      .chain(apply("createDoc"))
      .chain(is(validResult, INVALID_RESULT)),
  get: (store, key) =>
    of({ store, key })
      .chain(is(validKey, INVALID_KEY))
      .chain(apply("getDoc"))
      .chain(is(validResult, INVALID_RESULT)),
  update: (store, key, value, ttl) =>
    of({ store, key, value, ttl })
      .map(convertTTL)
      .chain(is(validKey, INVALID_KEY))
      .chain(apply("updateDoc"))
      .chain(is(validResult, INVALID_RESULT)),
  delete: (store, key) =>
    of({ store, key })
      .chain(is(validKey, INVALID_KEY))
      .chain(apply("deleteDoc"))
      .chain(is(validResult, INVALID_RESULT)),
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
