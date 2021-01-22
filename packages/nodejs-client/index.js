const createRequest = require('./request')
const qs = require('querystring')

if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch')
}

const fetch = globalThis.fetch

/**
 * @param {string} host = provide the host url for hyper63 service
 * @param {string} client - provide unique string representing this client app
 * @param {string} secret - provide a shared secret used to sign the jwt 
 * @param {string} app - app name
 * @returns {Object}
 */
module.exports = (host, client, secret, app) => {
  const $ = createRequest(fetch, client, secret)
  return Object.freeze({
    setup: {
      db: () => $.put(`${host}/data/${app}`),
      cache: () => $.put(`${host}/cache/${app}`),
      search: (mappings={}) => $.put(`${host}/search/${app}`, mappings)
    },
    cache: {
      query: pattern => $.get(`${host}/cache/${app}?${qs.stringify({pattern: pattern || '*'})}`),
      post: doc => $.post(`${host}/cache/${app}`, doc),
      get: id => $.get(`${host}/cache/${app}/${id}`),
      put: doc => $.put(`${host}/cache/${app}/${doc.id}`, doc),
      remove: id => $.remove(`${host}/cache/${app}/${id}`)
    },
    data: {
      query: (criteria) => $.post(`${host}/data/${app}/_query`, criteria),
      list: (options) => $.get(`${host}/data/${app}${options ? '?' + qs.stringify(options) : ''}`),
      get: (id) => $.get(`${host}/data/${app}/${id}`),
      create: (doc) => $.post(`${host}/data/${app}`, doc),
      update: (id, doc) => $.put(`${host}/data/${app}/${id}`, doc),
      remove: (id) => $.remove(`${host}/data/${app}/${id}`),
      index: (idx) => $.post(`${host}/data/${app}/_index`, idx)
    },
    search: {
      query: (query) => $.post(`${host}/search/${app}/_query`, query),
      create: (doc) => $.post(`${host}/search/${app}`, doc),
      remove: (key) => $.remove(`${host}/search/${app}/${key}`)
    }
  })
}
 


