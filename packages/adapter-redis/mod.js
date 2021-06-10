
import { redis } from './deps.js'

import createAdapter from './adapter.js'

/**
 * @typedef RedisClientArgs
 * @property {string} hostname
 * @property {number?} port - defaults to 6379
 *
 * @param {RedisClientArgs} config
 * @returns {object}
 */
export default function RedisCacheAdapter (config) {
  function load () {
    return config
  }

  /**
   * @param {RedisClientArgs} env
   * @returns {function}
   */
  function link (env) {
    /**
     * @param {object} adapter
     * @returns {object}
     */
    return function () {
      // create client
      const client = redis.connect(env)
      return createAdapter(client)
    }
  }

  return Object.freeze({
    id: 'redis-cache-adapter',
    port: 'cache',
    load,
    link
  })
}
