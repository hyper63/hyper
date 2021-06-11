
import { R, crocks, path } from './deps.js'

const { Async } = crocks
const { always, identity } = R

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
export default function (root) {
  if (!root) { throw new Error('STORAGE: FS_Adapter: root directory required for this service!') }
  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function makeBucket (name) {
    if (!name) { return Promise.reject({ ok: false, msg: 'name for bucket is required!' }) }

    const mkdir = Async.fromPromise(Deno.mkdir.bind(Deno))

    return mkdir(path.resolve(path.join(root, name)))
      .bimap(
        err => ({ ok: false, error: err.message }),
        always({ ok: true })
      )
      .toPromise()
  }

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function removeBucket (name) {
    if (!name) { return Promise.reject({ ok: false, msg: 'name for bucket is required!' }) }

    const rmdir = Async.fromPromise(Deno.remove.bind(Deno))

    // TODO: Tyler. Do we want to do a recursive remove here?
    return rmdir(path.resolve(path.join(root, name)))
      .bimap(
        err => ({ ok: false, error: err.message }),
        always({ ok: true })
      )
      .toPromise()
  }

  /**
   * @param {StorageObject}
   * @returns {Promise<Response>}
   */
  async function putObject ({ bucket, object, stream }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }
    if (!object) { return Promise.reject({ ok: false, msg: 'object name required' }) }
    if (!stream) { return Promise.reject({ ok: false, msg: 'stream is required' }) }

    let file
    try {
      // Create Writer
      file = await Deno.create(
        path.join(
          path.resolve(path.join(root, bucket)),
          object
        )
      )

      // Copy Reader into Writer
      await Deno.copy(stream, file)

      return { ok: true }
    } catch (err) {
      return { ok: false, msg: err.message }
    } finally {
      file && await file.close()
    }
  }

  /**
   * @param {StorageInfo}
   * @returns {Promise<Response>}
   */
  function removeObject ({ bucket, object }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }
    if (!object) { return Promise.reject({ ok: false, msg: 'object name required' }) }

    const rm = Async.fromPromise(Deno.remove.bind(Deno))

    return rm(
      path.resolve(path.join(root, bucket, object))
    ).bimap(
      err => ({ ok: false, error: err.message }),
      always({ ok: true })
    ).toPromise()
  }

  /**
   * @param {StorageInfo}
   * @returns {Promise<stream>}
   */
  function getObject ({ bucket, object }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }
    if (!object) { return Promise.reject({ ok: false, msg: 'object name required' }) }

    const open = Async.fromPromise(Deno.open.bind(Deno))

    return open(
      path.resolve(path.join(root, bucket, object)), {
        read: true,
        write: false
      }
    ).bimap(
      err => ({ ok: false, msg: err.message }),
      identity
    ).toPromise()
  }

  async function listObjects ({ bucket, prefix = '' }) {
    if (!bucket) { return Promise.reject({ ok: false, msg: 'bucket name required' }) }

    const files = []
    try {
      for await (
        const dirEntry of Deno.readDir(
          path.resolve(path.join(root, bucket, prefix))
        )
      ) {
        files.push(dirEntry.name)
      }

      return files
    } catch (err) {
      return { ok: false, error: err.message }
    }
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
