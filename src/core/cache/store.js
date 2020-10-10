const { is, of, apply } = require("../utils");
const INVALID_NAME_MSG = "name is not valid";
const INVALID_RESULT_MSG = "result is not valid";

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
const create = (name) =>
  of(name)
    .chain(is(validName, INVALID_NAME_MSG))
    .chain(apply("createStore"))
    .chain(is(validResult, INVALID_RESULT_MSG));

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
const del = (name) =>
  of(name)
    .chain(is(validName, INVALID_NAME_MSG))
    .chain(apply("destroyStore"))
    .chain(is(validResult, INVALID_RESULT_MSG));

/**
 * @param {string} name
 * @param {string} pattern
 * @returns {AsyncReader}
 */
const query = (name, pattern) =>
  of(name)
    .chain(is(validName, INVALID_NAME))
    .map((name) => ({ store: name, pattern }))
    .chain(apply("listDocs"))
    .chain(is(validResult, INVALID_RESULT));

module.exports = {
  create,
  delete: del,
  query,
};

// validators predicate functions

/**
 * @param {string} name
 * @returns {boolean}
 */
function validName(name) {
  // verify that the name does not contains spaces
  // verify that the name does not contain slashes
  // verify that the name contains URI friendly characters
  // should return a Either Right or Left
  //return Left({ ok: false, msg: "name not valid"});
  return true;
}

/**
 * @param {object} result
 * @returns {boolean}
 */
function validResult(result) {
  // return Left({ ok: false, msg: 'result is invalid'})
  return true;
}
