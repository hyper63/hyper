const MiniSearch = require('minisearch')
const { allPass, keys, reduce } = require('ramda')
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
  *
  * @typedef {Object} Response
  * @property {boolean} ok
  * @property {string} [msg]
 */

module.exports = function () {
  const indexes = new Map()
  const datastores = new Map()

  /**
   * @param {IndexInfo}
   * @returns {Promise<Response>}
   */
  function createIndex ({ index, mappings }) {
    if (!index) { return Promise.reject({ ok: false, msg: 'name is required to create index' }) }
    if (!mappings) { return Promise.reject({ ok: false, msg: 'mappings object required, it should have fields property and storedFields property.' }) }
    const sindex = new MiniSearch(mappings)
    const store = new Map()
    indexes.set(index, sindex)
    datastores.set(index, store)
    return Promise.resolve({ ok: true })
  }

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function deleteIndex (name) {
    if (!name) { return Promise.reject({ ok: false, msg: 'name is required to create index' }) }
    indexes.delete(name)
    datastores.delete(name)
    return Promise.resolve({ ok: true })
  }

  /**
   * @param {SearchDoc}
   * @returns {Promise<Response>}
   */
  function indexDoc ({ index, key, doc }) {
    if (!index) { return Promise.reject({ ok: false, msg: 'index name is required!' }) }
    if (!key) { return Promise.reject({ ok: false, msg: 'key is required!' }) }
    if (!doc) { return Promise.reject({ ok: false, msg: 'doc is required!' }) }

    const search = indexes.get(index)
    const store = datastores.get(index)
    search.add(doc)
    store.set(key, doc)
    return Promise.resolve({ ok: true })
  }

  /**
   * @param {SearchInfo}
   * @returns {Promise<Response>}
   */
  function getDoc ({ index, key }) {
    if (!index) { return Promise.reject({ ok: false, msg: 'index name is required!' }) }
    if (!key) { return Promise.reject({ ok: false, msg: 'key is required!' }) }

    const store = datastores.get(index)
    const doc = store.get(key)
    return Promise.resolve(doc === undefined ? null : doc)
  }

  /**
   * @param {SearchDoc}
   * @returns {Promise<Response>}
   */
  function updateDoc ({ index, key, doc }) {
    if (!index) { return Promise.reject({ ok: false, msg: 'index name is required!' }) }
    if (!key) { return Promise.reject({ ok: false, msg: 'key is required!' }) }
    if (!doc) { return Promise.reject({ ok: false, msg: 'doc is required!' }) }

    const search = indexes.get(index)
    const store = datastores.get(index)
    const oldDoc = store.get(key)
    search.remove(oldDoc)
    search.add(doc)
    store.set(key, doc)
    return Promise.resolve({ ok: true })
  }

  /**
   * @param {SearchInfo}
   * @returns {Promise<Response>}
   */
  function removeDoc ({ index, key }) {
    if (!index) { return Promise.reject({ ok: false, msg: 'index name is required!' }) }
    if (!key) { return Promise.reject({ ok: false, msg: 'key is required!' }) }

    const search = indexes.get(index)
    const store = datastores.get(index)
    const oldDoc = store.get(key)
    search.remove(oldDoc)
    store.delete(key)
    return Promise.resolve({ ok: true })
  }

  /**
   * @param {BulkIndex}
   * @returns {Promise<ResponseWitResults>}
   */
  function bulk ({ index, docs }) {
    if (!index) { return Promise.reject({ ok: false, msg: 'index name is required!' }) }
    if (!docs) { return Promise.reject({ ok: false, msg: 'docs is required!' }) }

    const search = indexes.get(index)
    search.addAll(docs)
    return Promise.resolve({ ok: true, results: [] })
  }

  function createFilterFn (object) {
    return allPass(reduce(
      (acc, k) => {
        return acc.concat(result => result[k] === object[k])
      },
      [],
      keys(object)
    ))
  }
  /**
   *
   * @param {SearchQuery}
   * @returns {Promise<Array>}
   */
  function query ({ index, q: { query, fields, filter } }) {
    if (!index) { return Promise.reject({ ok: false, msg: 'index name is required!' }) }
    if (!query) { return Promise.reject({ ok: false, msg: 'query is required!' }) }

    const search = indexes.get(index)
    let options = {}
    // if fields
    options = fields ? { ...options, fields } : options
    if (filter) {
      options = { ...options, filter: createFilterFn(filter) }
    }

    const results = search.search(query, options)
    return Promise.resolve({ ok: true, matches: results })
  }

  return Object.freeze({
    createIndex,
    deleteIndex,
    indexDoc,
    getDoc,
    updateDoc,
    removeDoc,
    bulk,
    query
  })
}
