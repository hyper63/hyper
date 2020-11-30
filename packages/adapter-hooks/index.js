const { merge } = require('ramda')
const { Async } = require('crocks')
const createFetch = require('@vercel/fetch')
const nodeFetch = require('node-fetch')
const createAdapter = require('./adapter.js')

const fetch = createFetch(nodeFetch)
const asyncFetch = Async.fromPromise(fetch)

module.exports = function(hooks) {
  return Object.freeze({
    id: 'hooks',
    port: 'hooks',
    load: merge({hooks}), 
    link: env => _ => createAdapter({asyncFetch, hooks}) 
  })
}

