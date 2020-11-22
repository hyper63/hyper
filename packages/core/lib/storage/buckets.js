const { is, of, apply, triggerEvent } = require('../utils')

const INVALID_BUCKET_MSG = "bucket name is not valid";
const INVALID_RESPONSE = "response is not valid";

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
exports.make = (name) =>
  of(name)
    //.chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply("makeBucket"))
    .chain(triggerEvent('STORAGE:CREATE_BUCKET'));
//.chain(is(validResponse, INVALID_RESPONSE));

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
exports.remove = (name) => 
  of(name)
    .chain(apply("removeBucket"))
    .chain(triggerEvent('STORAGE:DELTE_BUCKET'));

/**
 * @returns {AsyncReader}
 */
exports.list = () => of().chain(apply("listBuckets"));
