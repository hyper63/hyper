const Async = require("crocks/Async");
const fetch = require("@zeit/fetch-retry")(require("node-fetch"));
const asyncFetch = Async.fromPromise(fetch);
const base64 = (s) => Buffer.from(s).toString("base64");
/**
 * @param {string} dbname
 * @returns {Async}
 */
const createDatabase = (config) => (dbname) =>
  asyncFetch(`${config.db}/${dbname}`, {
    method: "PUT",
    headers: {
      authorization: `Basic ${base64(config.user + ":" + config.password)}`,
    },
  }).chain((result) => {
    const toJSON = Async.fromPromise(result.json.bind(result));
    if (result.status >= 300) {
      return toJSON().chain((r) => Async.Rejected(r));
    }
    return toJSON();
  });

/**
 * @param {string} dbname
 * @returns {Async}
 */
const removeDatabase = (config) => (dbname) =>
  asyncFetch(`${config.db}/${dbname}`, {
    method: "DELETE",
    headers: {
      authorization: `Basic ${base64(config.user + ":" + config.password)}`,
    },
  });
// TODO
module.exports = (config) => {
  return Object.freeze({
    createDatabase: createDatabase(config),
    removeDatabase: removeDatabase(config),
  });
};
