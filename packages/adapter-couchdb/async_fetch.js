import createFetch from '@vercel/fetch-retry'
import nodeFetch from 'node-fetch'
import { Async } from 'crocks'
import {ifElse, propEq} from 'ramda'
import { composeK } from 'crocks/helpers'

const fetch = createFetch(nodeFetch)
export const asyncFetch = Async.fromPromise(fetch)
//export const asyncFetch = Async.fromPromise(nodeFetch)
export const createHeaders = (username, password) => ({
  'Content-Type': 'application/json',
  authorization: `Basic ${Buffer.from(username + ':' + password).toString('base64')}`
})
const toJSON = (result) => Async.fromPromise(result.json.bind(result))(result);
const toJSONReject = composeK(Async.Rejected, toJSON);
export const handleResponse = (code) =>
  ifElse(propEq("status", code), toJSON, toJSONReject);


