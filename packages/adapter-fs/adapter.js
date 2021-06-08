const fs = require('fs')
const path = require('path')
const { Async } = require('crocks')
const { always } = require('ramda')

/**
 * hyper63 adapter for the storage port
 *
 * This adapter uses the file system
 * as the implementation details for
 * the storage port.
 *
 *
 * @typedef {Object} StorageInfo
 * @property {string} bucket
 * @property {string} object
 *
 * @typedef {Object} StorageObject
 * @property {string} bucket
 * @property {string} object
 * @property {stream} stream
 *
 * @typedef {Object} Response
 * @property {boolean} ok
 * @property {string} [msg] - error message
 */
/**
 * @param {string} path
 * @returns {Object}
 */
module.exports = function (root) {
  if (!root) { throw new Error('STORAGE: FS_Adapter: root directory required for this service!') }
  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function makeBucket (name) {
    if (!name) { return Promise.reject({ ok: false, msg: 'name for bucket is required!' }) }
    const mkdir = Async.fromNode(fs.mkdir)
    return mkdir(path.resolve(root + '/' + name))
      .map(always({ ok: true }))
      .toPromise()
  }

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function removeBucket (name) {
    if (!name) { return Promise.reject({ ok: false, msg: 'name for bucket is required!' }) }
    const rmdir = Async(function (reject, resolve) {
      fs.rmdir(path.resolve(root + '/' + name), (err) => {
        if (err) { return reject({ ok: false, error: err.message }) }
        resolve({ ok: true })
      })
    })

    return rmdir
      .map(always({ ok: true }))
      .toPromise()
  }

  /**
   * @param {StorageObject}
   * @returns {Promise<Response>}
   */
  function putObject ({ bucket, object, stream }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }
    if (!object) { return Promise.reject({ ok: false, msg: 'object name required' }) }
    if (!stream) { return Promise.reject({ ok: false, msg: 'stream is required' }) }

    return new Promise(function (resolve, reject) {
      const s = fs.createWriteStream(
        path.resolve(`${root}/${bucket}`) + `/${object}`
      )

      stream.on('end', () => {
        resolve({ ok: true })
      })

      stream.on('error', (e) => {
        reject({ ok: false, msg: e.message })
      })

      stream.pipe(s)
    })
  }

  /**
   * @param {StorageInfo}
   * @returns {Promise<Response>}
   */
  function removeObject ({
    bucket,
    object
  }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }
    if (!object) { return Promise.reject({ ok: false, msg: 'object name required' }) }

    const rm = Async(function (reject, resolve) {
      fs.unlink(path.resolve(`${root}/${bucket}/${object}`), (err) => {
        if (err) { return reject({ ok: false, msg: err.message }) }
        resolve({ ok: true })
      })
    })
    rm.toPromise()
  }

  /**
   * @param {StorageInfo}
   * @returns {Promise<stream>}
   */
  function getObject ({
    bucket,
    object
  }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }
    if (!object) { return Promise.reject({ ok: false, msg: 'object name required' }) }
    return Async(function (reject, resolve) {
      try {
        const s = fs.createReadStream(path.resolve(`${root}/${bucket}/${object}`))
        resolve(s)
      } catch (e) {
        reject({ ok: false, msg: e.message })
      }
    }).toPromise()
  }

  function listObjects ({ bucket, prefix = '' }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }
    return fs.promises.readdir(path.resolve(`${root}/${bucket}/${prefix}`))
  }

  return Object.freeze({
    makeBucket,
    removeBucket,
    listBuckets: () => null,
    putObject,
    removeObject,
    getObject,
    listObjects

  })
}
