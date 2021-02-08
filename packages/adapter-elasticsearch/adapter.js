
const { pluck, reduce, always, pipe, map, join } = require('ramda')

/**
  * @typedef {Object} Mappings
  * @property {Array<string>} fields - fields to be used to search
  * @property {Array<string>} [storeFields] - fields to be return as result
  * 
  * 
  * @typedef {Object} IndexInfo
  * @property {string} index - index name
  * @property {Mappings} mappings - index setup
  * 
  * @typedef {Object} BulkSearchDoc
  * @property {boolean} ok
  * @property {string} [msg]
  * @property {Array<any>} results
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
  * 
  * @typedef {Object} ResponseWithResults
  * @property {boolean} ok
  * @property {string} [msg]
  * @property {Array<any>} results
  * 
  * @typedef {Object} ResponseWithMatches
  * @property {boolean} ok
  * @property {string} [msg]
  * @property {Array<any>} matches
 */

/**
 * Map hyper63 mappings shape to an Elasticsearch shape
 *
 * @param {Array<string>} fieldsToIndex
 * @param {Array<string>} fieldsToStore
 */
function createMappingProperties (fieldsToIndex, fieldsToStore) {
  return reduce(
    (acc, storeField) => ({
      ...acc,
      // TODO: support nested fields with dot notation?
      [storeField]: { 
        index: fieldsToIndex.includes(storeField)
      }
    }),
    {},
    fieldsToStore
  )
}

module.exports = function ({ config, asyncFetch, headers, handleResponse }) {

  /**
   * @param {IndexInfo} 
   * @returns {Promise<Response>}
   */
  function createIndex ({ index, mappings }) {
    // default storeFields to the fields used for full text search
    if (!mappings.storeFields || !mappings.storeFields.length) {
      mappings.storeFields = mappings.fields
    }

    return asyncFetch(
      `${config.origin}/${index}`, {
        headers,
        method: 'PUT',
        // See https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html#create-mapping
        body: JSON.stringify({
          dynamic: true,
          mappings: {
            properties: createMappingProperties(mappings.fields, mappings.storeFields)
          }
        })
      }
    )
      .chain(
        handleResponse(res => res.status < 400)
      )
      .bimap(
        always({ ok: false }),
        always({ ok: true })
      )
      .toPromise()
  }

  /**
   * @param {string} index
   * @returns {Promise<Response>}
   */
  function deleteIndex (index) {
    return asyncFetch(`${config.origin}/${index}`, {
      method: 'DELETE',
      headers
    })
      .chain(
        handleResponse(res => res.status === 200)
      )
      .bimap(
        always({ ok: false }),
        always({ ok: true })
      )
      .toPromise()
  }

  /**
   * @param {SearchDoc}
   * @returns {Promise<Response>}
   */
  function indexDoc ({ index, key, doc }) {
    return asyncFetch(`${config.origin}/${index}/_doc/${key}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(doc)
    })
      .chain(
        handleResponse(res => res.status < 400)
      )
      .bimap(
        always({ ok: false }),
        always({ ok: true })
      )
      .toPromise()
  }

  /**
   * @param {SearchInfo}
   * @returns {Promise<Response>}
   */
  function getDoc ({ index, key }) {
    return asyncFetch(`${config.origin}/${index}/_doc/${key}/_source`, {
      method: 'GET',
      headers
    })
      .chain(
        handleResponse(res => res.status === 200)
      )
      .bimap(
        always({ ok: false }),
        res => ({ ok: true, doc: res })
      )
      .toPromise()
  }

  /**
   * @param {SearchDoc}
   * @returns {Promise<Response>}
   */
  function updateDoc ({ index, key, doc }) {
    asyncFetch(`${config.origin}/${index}/_doc/${key}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(doc)
    })
      .chain(
        handleResponse(res => res.status === 200)
      )
      .bimap(
        always({ ok: false }),
        always({ ok: true })
      )
      .toPromise()
  }

  /**
   * @param {SearchInfo}
   * @returns {Promise<Response>}
   */
  function removeDoc () {
    asyncFetch(`${config.origin}/${index}/_doc/${key}`, {
      method: 'DELETE',
      headers
    })
      .chain(
        handleResponse(res => res.status === 200)
      )
      .bimap(
        always({ ok: false }),
        always({ ok: true })
      )
      .toPromise()
  }

  /**
   * @param {BulkIndex}
   * @returns {Promise<ResponseWithResults>}
   *
   * TODO: maybe we could just Promise.all a map to indexDoc()?
   */
  function bulk ({ index, docs }) {
    return asyncFetch(`${config.origin}/_bulk`, {
      method: 'POST',
      headers,
      // See https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html#docs-bulk-api-example
      body: pipe(
        reduce(
          (arr, doc) =>
            [...arr, { index: { _index: index, _id: doc.id } }, doc],
          []
        ),
        map(JSON.stringify.bind(JSON)),
        join('\n'),
        JSON.stringify.bind(JSON)
      )(docs)
    })
      .chain(
        handleResponse(res => res.status < 400)
      )
      .bimap(
        always({ ok: false }),
        res => ({ ok: true, results: res })
      )
      .toPromise()
  }

  /**
   * 
   * @param {SearchQuery}
   * @returns {Promise<ResponseWithMatches>}  
   */
  function query ({ index, q: { query, fields, filter } }) {
    return asyncFetch(`${config.origin}/${index}/_search`, {
      method: 'POST',
      headers,
      // anything undefined will not be stringified, so this shorthand works
      body: JSON.stringify({
        query: {
          bool: {
            must: {
              multi_match: {
                query,
                fields
              }
            },
            filter
          }
        }
      })
    })
      .chain(handleResponse(200))
      .bimap(
        // TODO: what should message be for a failed query?
        r => ({ ok: false, msg: JSON.stringify(r) }),
        r => ({
          ok: true,
          matches: pluck('_source', r.hits.hits)
        })
      )
      .toPromise()
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