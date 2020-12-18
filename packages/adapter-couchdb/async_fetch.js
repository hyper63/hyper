const createFetch = require('@vercel/fetch-retry')
const nodeFetch = require('node-fetch')
const { Async } = require('crocks')
const { ifElse, propEq } = require('ramda')
const { composeK } = require('crocks/helpers')

const fetch = createFetch(nodeFetch)
exports.asyncFetch = Async.fromPromise(fetch)
//export const asyncFetch = Async.fromPromise(nodeFetch)
exports.createHeaders = (username, password) => ({
  'Content-Type': 'application/json',
  authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
})
const toJSON = (result) => Async.fromPromise(result.json.bind(result))(result);
const toJSONReject = composeK(Async.Rejected, toJSON);

exports.handleResponse = (code) =>
  ifElse(propEq("status", code), toJSON, toJSONReject);


