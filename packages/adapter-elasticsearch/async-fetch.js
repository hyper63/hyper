const createFetch = require('@vercel/fetch-retry')
const nodeFetch = require('node-fetch')
const { Async } = require('crocks')
const { composeK } = require('crocks/helpers')
const { ifElse, propEq } = require('ramda')

const fetch = createFetch(nodeFetch)

const asyncFetch = Async.fromPromise(fetch)
//export const asyncFetch = Async.fromPromise(nodeFetch)
const createHeaders = (username, password) => ({
  'Content-Type': 'application/json',
  authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
})
const toJSON = (result) => Async.fromPromise(result.json.bind(result))(result);
const toJSONReject = composeK(Async.Rejected,
  r => Async.Resolved({ok: false})
  , toJSON);

const handleResponse = (code) =>
  ifElse(propEq("status", code), toJSON, toJSONReject);

module.exports = {
  asyncFetch,
  createHeaders,
  handleResponse
}
