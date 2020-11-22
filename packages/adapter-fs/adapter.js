const fs = require('fs')
const path = require('path')
const { Async } = require('crocks')
const { always } = require('ramda')


/**
 * @param {string} path
 * @returns {Object}
 */
module.exports = function (root) {

  /**
   * @param {string} name
   */
  function makeBucket(name) {
    const mkdir = Async.fromNode(fs.mkdir)
    return mkdir(path.resolve(root + '/' + name))
      .map(always({ok: true}))
      .toPromise()
  }

  /**
   * @param {string} name
   * 
   */
  function removeBucket(name) {
    const rmdir = Async(function(reject, resolve) {
      fs.rmdir(path.resolve(root + '/' + name), (err) => {
        if (err) { return reject({ok: false, error: err.message })}
        resolve({ok: true})
      })
    })

    return rmdir
      .map(always({ok: true}))
      .toPromise()
  }

  /**
   * @typedef {Object} StorageObject
   * @property {string} bucket
   * @property {string} object
   * @property {stream} stream
   */

  /**
   * @param {StorageObject} 
   */
  function putObject ({bucket, object, stream}) {
    return new Promise(function(resolve, reject) {
      const s = fs.createWriteStream(
        path.resolve(`${root}/${bucket}`) + `/${object}`  
      )

      stream.on('end', () => {
        resolve({ok: true})
      })

      stream.on('error', (e) => {
        reject({ok: false, error: e.message})
      })

      stream.pipe(s)
  
    })
  }

  /**
   * @param {Object}
   */
  function removeObject({
    bucket,
    object
  }) {
    const rm = Async(function(reject, resolve) {
      fs.unlink(path.resolve(`${root}/${bucket}/${object}`), (err) => {
        if (err) { return reject({ok:false, error: err.message }) }
        resolve({ok: true})
      })
    })
    rm.toPromise()
  }

  /**
   * @param {Object}
   */
  function getObject({
    bucket, 
    object
  }) {
    return Async(function (reject, resolve) {
      try {
        let s = fs.createReadStream(path.resolve(`${root}/${bucket}/${object}`))
        resolve(s)
      } catch (e) {
        reject({ok: false, error: e.message })
      }
    }).toPromise()
  }

  function listObjects ({
    bucket,
    prefix = ""
  }) {
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