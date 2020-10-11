const Async = require("crocks/Async");
const composeK = require("crocks/helpers/composeK");
const { propEq, ifElse } = require("ramda");
const fetch = require("@zeit/fetch-retry")(require("node-fetch"));
const asyncFetch = Async.fromPromise(fetch);
const toJSON = (result) => Async.fromPromise(result.json.bind(result))(result);
const toJSONReject = composeK(Async.Rejected, toJSON);
const handleResponse = (code) =>
  ifElse(propEq("status", code), toJSON, toJSONReject);
const base64 = (s) => Buffer.from(s).toString("base64");
const createHeaders = (user, password) => ({
  "content-type": "application/json",
  authorization: `Basic ${base64(user + ":" + password)}`,
});
/**
 * @param {string} dbname
 * @returns {Async}
 */
const createDatabase = (config) => (dbname) =>
  asyncFetch(`${config.db}/${dbname}`, {
    method: "PUT",
    headers: createHeaders(config.user, config.password),
  }).chain(handleResponse(201));

/**
 * @param {string} dbname
 * @returns {Async}
 */
const removeDatabase = (config) => (dbname) =>
  asyncFetch(`${config.db}/${dbname}`, {
    method: "DELETE",
    headers: createHeaders(config.user, config.password),
  }).chain(handleResponse(200));

/**
 * @param {string} dbname
 * @param {Object} document
 * @returns {Async}
 */
const createDocument = (config) => ({ db, id, doc }) =>
  Async.of({ ...doc, _id: id })
    .chain((doc) =>
      asyncFetch(`${config.db}/${db}`, {
        method: "POST",
        headers: createHeaders(config.user, config.password),
        body: JSON.stringify(doc),
      })
    )
    .chain(handleResponse(201));

/**
 * @param {string} dbname
 * @param {string} id
 * @returns {Async}
 */
const retrieveDocument = (config) => ({ db, id }) =>
  asyncFetch(`${config.db}/${db}/${id}`, {
    headers: createHeaders(config.user, config.password),
  }).chain(handleResponse(200));

/**
 * @param {string} dbname
 * @param {string} id
 * @param {string} doc
 * @returns {Async}
 */
const updateDocument = (config) => ({ db, id, doc }) =>
  retrieveDocument(config)({ db, id })
    .chain((old) =>
      asyncFetch(`${config.db}/${db}/${id}?rev=${old._rev}`, {
        method: "PUT",
        headers: createHeaders(config.user, config.password),
        body: JSON.stringify(doc),
      })
    )
    .chain(handleResponse(201));

/**
 * @param {string} dbname
 * @param {string} id
 * @returns {Async}
 *
 */
const removeDocument = (config) => ({ db, id }) =>
  retrieveDocument(config)({ db, id })
    .chain((old) =>
      asyncFetch(`${config.db}/${db}/${id}?rev=${old._rev}`, {
        method: "DELETE",
        headers: createHeaders(config.user, config.password),
      })
    )
    .chain(handleResponse(200));

module.exports = (config) => {
  return Object.freeze({
    createDatabase: createDatabase(config),
    removeDatabase: removeDatabase(config),
    createDocument: createDocument(config),
    retrieveDocument: retrieveDocument(config),
    updateDocument: updateDocument(config),
    removeDocument: removeDocument(config),
  });
};
