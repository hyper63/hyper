globalThis.fetch = require('@vercel/fetch-retry')(require('node-fetch'))
const createAdapter = require('./adapter')
const { asyncFetch, createHeaders, handleResponse } = require('./async-fetch')

/**
 * @param {object} config
 * @returns {object}
 */
module.exports = function CouchDataAdapter (config) {
  /**
   * @param {object} env
   */
  function load () {
    return config
  }

  /**
   * @param {object} env
   * @returns {function}
   */
  function link (env = { url: 'http://localhost:5984' }) {
    /**
     * @param {object} adapter
     * @returns {object}
     */
    return function () {
      // parse url
      const config = new URL(env.url)

      return createAdapter({ config })
    }
  }

  return Object.freeze({
    id: 'couchdb-data-adapter',
    port: 'data',
    load,
    link
  })
}
