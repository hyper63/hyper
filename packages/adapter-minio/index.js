const createAdapter = require('./adapter')
const Minio = require('minio')

/**
 * @param {object} config
 * @returns {object}
 */
module.exports = function MinioStorageAdapter (config) {
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
  function link (env) {
    /**
     * @param {object} adapter
     * @returns {object}
     */
    return function () {
      // parse url
      const config = new URL(env.url)
      const client = new Minio.Client({
        endPoint: config.hostname,
        accessKey: config.username,
        secretKey: config.password,
        useSSL: config.protocol === 'https:',
        port: Number(config.port)
      })
      return createAdapter(client)
    }
  }

  return Object.freeze({
    id: 'minio-storage-adapter',
    port: 'storage',
    load,
    link
  })
}
