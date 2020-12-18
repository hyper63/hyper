const { merge, omit } = require('ramda') 

/**
 * hyper63 memory adapter
 * 
 * This adapter works with the cache port
 * and supports the ability to cache documents
 * in memory.
 * 
 * @typedef {Object} CacheDoc
 * @property {string} store - cache store
 * @property {string} key - unique string for document
 * @property {Object} value - value for document
 * @property {string} [ttl] - time to live - 1d, 1h, 1m, 1s
 * 
 * @typedef {Object} CacheInfo
 * @property {string} store
 * @property {string} key
 * 
 * @typedef {Object} CacheQuery
 * @property {string} store
 * @property {string} pattern - pattern to match keys
 * 
 * @typedef {Object} Response
 * @property {boolean} ok
 * @property {string} [doc]
 * @property {Array} [docs]
 * @property {string} [msg]
 */
module.exports = function adapter () {
  let stores = {}

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function createStore(name) {
    if (!name) {
      return Promise.reject({ok: false, msg: 'name must be a string value'})
    }
    const store = new Map()
    stores = merge({ [name]: store }, stores)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function destroyStore(name) {
    stores = omit([name], stores)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {CacheDoc} 
   * @returns {Promise<Response>}
   */
  function createDoc({store, key, value, ttl}) {
    if (!store) { return Promise.reject({ok: false, msg: 'store required'})}
    if (!key) { return Promise.reject({ok: false, msg: 'key is required'})}
    if (!value) { return Promise.reject({ok: false, msg: 'value is required'})}

    if (!stores[store]) { return Promise.reject({ok: false, msg: 'store is not found!'})}
    
    stores[store].set(key, value)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {CacheInfo}
   * @returns {Promise<Response>}
   */
  function getDoc({store, key}) {
    if (!store) { return Promise.reject({ok: false, msg: 'store required'})}
    if (!key) { return Promise.reject({ok: false, msg: 'key is required'})}
   
    return Promise.resolve({ ok: true, doc: stores[store].get(key) })
  }

  /**
   * @param {CacheDoc}
   * @returns {Promise<Response>}
   */
  function updateDoc({store, key, value, ttl}) {
    if (!store) { return Promise.reject({ok: false, msg: 'store required'})}
    if (!key) { return Promise.reject({ok: false, msg: 'key is required'})}
    if (!value) { return Promise.reject({ok: false, msg: 'value is required'})}
    
    stores[store].set(key, value)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {CacheInfo}
   * @returns {Promise<Response>}
   */
  function deleteDoc({store, key}) {
    if (!store) { return Promise.reject({ok: false, msg: 'store required'})}
    if (!key) { return Promise.reject({ok: false, msg: 'key is required'})}
    
    stores[store].delete(key)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {CacheQuery}
   * @returns {Promise<Response>}
   */
  function listDocs({store, pattern}) {
    if (!store) { return Promise.reject({ok: false, msg: 'store required'})}
    
    // https://stackoverflow.com/questions/26246601/wildcard-string-comparison-in-javascript
    let docs = []
    function match(str, rule) {
      var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      return new RegExp("^" + rule.split("*").map(escapeRegex).join(".*") + "$").test(str);
    }

    stores[store].forEach((value, key) => {
      if (match(key, pattern)) {
        docs.push({key, value})
      }
    })
    return Promise.resolve({ok: true, docs })
  }

  return Object.freeze({
    createStore,
    destroyStore,
    createDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    listDocs
  })
}