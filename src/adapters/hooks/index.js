import R from 'ramda'
import crocks from 'crocks'
import createFetch from '@vercel/fetch'
import * as nodeFetch from 'node-fetch'
import { default as createAdapter } from './adapter.js'

const { merge } = R
const { Async } = crocks

const fetch = createFetch(nodeFetch)
const asyncFetch = Async.fromPromise(fetch)

export default function(hooks) {
  return Object.freeze({
    id: 'hooks',
    port: 'hooks',
    load: merge({hooks}), 
    link: env => _ => createAdapter({asyncFetch, hooks}) 
  })
}

