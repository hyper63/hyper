const MiniSearch = require('minisearch')
// types


/**
  * @typedef {Object} Mappings
  * @property {string} [idField] - unique id of doc
  * @property {function} [extractField] - function used to get value of a given field if not a string. (doc, fn) -> value
  * @property {function} [tokenize] - function used to override the tokenization of a given field
  * @property {function} [processTerm] - function used to process each token before indexing
  * @property {Object} [searchOptions]
  * @property {Array} fields - fields to be used to search
  * @property {Array} [storeFields] - fields to be return as result
  * 
  * 
  * @typedef {Object} IndexInfo
  * @property {string} index - index name
  * @property {object} mappings - index setup
  * 
  * @typedef {Object} SearchDoc
  * @property {string} index
  * @property {string} key
  * @property {Object} doc
  *
  * @typedef {Object} SearchInfo
  * @property {string} index
  * @property {string} key
  * 
  * @typedef {Object} SearchOptions
  * @property {Array<string>} fields
  * @property {Object} boost
  * @property {boolean} prefix
  * 
  * @typedef {Object} SearchQuery
  * @property {string} index
  * @property {string} query
  * @property {SearchOptions} [options]
 */

module.exports = function () {
  const indexes = new Map()
  const datastores = new Map()
  
  /**
   * @param {IndexInfo} 
   * @returns {Promise<object>}
   */
  function createIndex({name, mappings}) {
    const index = new MiniSearch(mappings)
    const store = new Map()
    indexes.set(name, index)
    datastores.set(name, store)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {string} name
   * @returns {Promise<Object>}
   */
  function deleteIndex(name) {
    indexes.delete(name)
    datastores.delete(name)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {SearchDoc}
   * @returns {Promise<object>}
   */
  function indexDoc({index, key, doc}) {
    const search = indexes.get(index)
    const store = datastores.get(index)
    search.add(doc)
    store.set(key, doc)
    return Promise.resolve({ok: true})
  }

  /**
   * @param {SearchInfo}
   * @returns {Promise<Object>}
   */
  function getDoc({index, key}) {
    const store = datastores.get(index)
    const doc = store.get(key)
    return Promise.resolve(doc === undefined ? null : doc)
  }

  /**
   * @param {SearchDoc}
   * @returns {Promise<Object>}
   */
  function updateDoc({index, key, doc}) {
    const search = indexes.get(index)
    const store = datastores.get(index)
    const oldDoc = store.get(key)
    search.remove(oldDoc)
    search.add(doc)
    store.set(key, doc)
    return Promise.resolve({ok: true})
  }
  
  /**
   * @param {SearchInfo}
   * @returns {Promise<Object>}
   */
  function removeDoc({index, key}) {
    const search = indexes.get(index)
    const store = datastores.get(index)
    const oldDoc = store.get(key)
    search.remove(oldDoc)
    store.delete(key)
    return Promise.resolve({ok: true}) 
  }

  /**
   * 
   * @param {SearchQuery}
   * @returns {Promise<array>}  
   */
  function search({index, query, options={}}) {
    const search = indexes.get(index)
    const results = search.search(query, options)
    return Promise.resolve(results)
  }

  return Object.freeze({
    createIndex,
    deleteIndex,
    indexDoc,
    getDoc,
    updateDoc,
    removeDoc,
    query: ({index, q}) => 
      search({
        index,
        query: q.query,
        options: q.options
      })
    
  })
}