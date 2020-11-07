import { default as createAdapter } from './adapter'
import createFetch from '@vercel/fetch'
import * as fetch from 'node-fetch'
import { Async } from 'crocks'
import { composeK } from 'crocks/helpers'
import { propEq, ifElse } from 'ramda'


const fetch = createFetch(fetch)

/**
 * @param {object} config
 * @returns {object}
 */
export function CouchDataAdapter (config) {
  /**
   * @param {object} env
   */
  function load() {
    return { url: config.COUCHDB } 
  }

  /**
   * @param {object} env
   * @returns {function}
   */
  function link(env) {
    /**
     * @param {object} adapter
     * @returns {object}
     */
    return function () {
      // parse url
      const config = new URL(env.url)
      const asyncFetch = Async.fromPromise(fetch)
      const headers = {
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from(config.username + ':' + config.password).toString('base64')}`
      }
      const toJSON = (result) => Async.fromPromise(result.json.bind(result))(result);
      const toJSONReject = composeK(Async.Rejected, toJSON);
      const handleResponse = (code) =>
        ifElse(propEq("status", code), toJSON, toJSONReject);

      return createAdapter({ config, asyncFetch, headers, handleResponse })
    }
  }

  return Object.freeze({
    id: 'couchdb-data-adapter',
    port: 'data',
    load,
    link
  })
}