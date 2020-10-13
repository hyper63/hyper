const { is, of, apply } = require("../utils");
const INVALID_BUCKET_MSG = "bucket name is not valid";
const INVALID_RESPONSE = "response is not valid";

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
const make = (name) =>
  of(name)
    //.chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply("makeBucket"));
//.chain(is(validResponse, INVALID_RESPONSE));

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
const remove = (name) => of(name).chain(apply("removeBucket"));

/**
 * @returns {AsyncReader}
 */
const list = () => of().chain(apply("listBuckets"));

module.exports = {
  make,
  remove,
  list,
};
