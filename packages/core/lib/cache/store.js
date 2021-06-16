import { apply, is, of, triggerEvent } from "../utils/mod.js";
import { R } from "../../deps.js";

const { toLower } = R;

const INVALID_NAME_MSG = "name is not valid";
const INVALID_RESULT_MSG = "result is not valid";

export const index = () => apply("index")().chain(triggerEvent("CACHE:INDEX"));

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
export const create = (name) =>
  of(name)
    .map(toLower)
    .chain(is(validName, INVALID_NAME_MSG))
    .chain(apply("createStore"))
    .chain(triggerEvent("CACHE:CREATE_STORE"))
    .chain(is(validResult, INVALID_RESULT_MSG));

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
export const del = (name) =>
  of(name)
    .chain(is(validName, INVALID_NAME_MSG))
    .chain(apply("destroyStore"))
    .chain(triggerEvent("CACHE:DELETE_STORE"))
    .chain(is(validResult, INVALID_RESULT_MSG));

/**
 * @param {string} name
 * @param {string} pattern
 * @returns {AsyncReader}
 */
export const query = (name, pattern) =>
  of(name)
    .chain(is(validName, INVALID_NAME_MSG))
    .map((name) => ({ store: name, pattern }))
    .chain(apply("listDocs"))
    .chain(triggerEvent("CACHE:LIST"))
    .chain(is(validResult, INVALID_RESULT_MSG));

// validators predicate functions

/**
 * @param {string} name
 * @returns {boolean}
 */
function validName(name) {
  // verify that the name does not contains spaces
  // verify that the name does not contain slashes
  // verify that the name contains URI friendly characters
  // should return a true or false
  return /^[a-z0-9-]+$/.test(name);
}

/**
 * @param {object} result
 * @returns {boolean}
 */
function validResult() {
  // return Left({ ok: false, msg: 'result is invalid'})
  return true;
}
