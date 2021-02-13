const createFetch = require('@vercel/fetch-retry')
const nodeFetch = require('node-fetch')
const { Async } = require('crocks')
const { ifElse } = require('ramda')

const fetch = createFetch(nodeFetch)

const asyncFetch = Async.fromPromise(fetch)

const createHeaders = (username, password) => ({
  'Content-Type': 'application/json',
  authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
})

const handleResponse = pred =>
  ifElse(
    res => pred(res),
    res => Async.fromPromise(() => res.json())(),
    res => Async.fromPromise(() => res.json())()
      .chain(Async.Rejected)
  )

module.exports = {
  asyncFetch,
  createHeaders,
  handleResponse
}
