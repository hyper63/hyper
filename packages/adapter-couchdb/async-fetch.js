const { Async } = require('crocks')
const { ifElse, propEq } = require('ramda')
const { composeK } = require('crocks/helpers')

// fetch is pulled from environment
// eslint-disable-next-line no-undef
exports.asyncFetch = Async.fromPromise(fetch)
exports.createHeaders = (username, password) => ({
  'Content-Type': 'application/json',
  authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
})
const toJSON = (result) => Async.fromPromise(result.json.bind(result))()
const toJSONReject = composeK(Async.Rejected, toJSON)

exports.handleResponse = (code) =>
  ifElse(propEq('status', code), toJSON, toJSONReject)
