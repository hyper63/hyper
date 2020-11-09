import { default as createAdapter } from './adapter'
import Minio from 'minio'

const fetch = createFetch(fetch)

/**
 * @param {object} config
 * @returns {object}
 */
export function MinioStorageAdapter (config) {
  /**
   * @param {object} env
   */
  function load() {
    return { url: config.MINIO } 
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
      const client = new Minio.Client({
        endPoint: config.hostname,
        accessKey: config.username,
        secretKey: config.password,
        secure: config.protocol === 'https:',
        port: config.port
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