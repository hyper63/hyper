import { default as createAdapter } from './adapter'
import { asyncFetch, createHeaders, handleResponse} from './async_fetch'

/**
 * @param {object} config
 * @returns {object}
 */
export default function CouchDataAdapter (config) {
  /**
   * @param {object} env
   */
  function load() {
    return config
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
      const headers = createHeaders(config.username, config.password)
      
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