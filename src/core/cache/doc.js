const { Do, of, apply } = require("../utils");
const hasProp = require("crocks/predicates/hasProp");
const INVALID_KEY = "key is not valid";
const INVALID_RESULT = "result is not valid";

module.exports = {
  create: (store, key, value, ttl) =>
    of({ store, key, value, ttl })
      .chain(Do(validateKey, INVALID_KEY))
      .chain(apply("createDoc"))
      .chain(Do(validateResult, INVALID_RESULT)),
  get: (store, key) =>
    of({ store, key })
      .chain(Do(validateKey, INVALID_KEY))
      .chain(apply("getDoc"))
      .chain(Do(validateResult, INVALID_RESULT)),
  update: (store, key, value) =>
    of({ store, key, value })
      .chain(Do(validateKey, INVALID_KEY))
      .chain(apply("updateDoc"))
      .chain(Do(validateResult, INVALID_RESULT)),
  delete: (store, key) =>
    of({ store, key })
      .chain(Do(validateKey, INVALID_KEY))
      .chain(apply("deleteDoc"))
      .chain(Do(validateResult, INVALID_RESULT)),
};

// validators predicate functions

function validateKey(name) {
  return true;
}

function validateResult(result) {
  if (result && hasProp("ok", result)) {
    return true;
  }
  console.log({ result });
  return false;
}
