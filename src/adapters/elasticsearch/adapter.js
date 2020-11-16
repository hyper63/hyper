import { Async } from 'crocks'
import { pluck } from 'ramda'

export default function ({config, asyncFetch, headers, handleResponse}) {
  /**
   * @typedef {Object} CreateIndexObject
   * @property {string} index
   * @property {Object} mappings
   * 
   * @param {CreateIndexObject} 
   * @returns {Promise<Object>}
   */
  const createIndex = ({ index, mappings}) => {
    return asyncFetch(
      `${config.origin}/${index}`, {
        headers,
        method: 'PUT',
        body: JSON.stringify(mappings)
      }
    )
     .chain(response => response.status < 400 
        ? Async.fromPromise(response.json.bind(response))()
        : Async.Rejected({ok: false })
     ) 
     .map(r => ({ok: true}))
     //.chain(handleResponse(201))
     .toPromise()
  }

  /**
   * @param {string} index
   * @returns {Promise<Object>}
   */
  const deleteIndex = (index) => asyncFetch(`${config.origin}/${index}`, {
    method: 'DELETE',
    headers
  }).chain(handleResponse(200))
    .toPromise()

  /**
   * @typedef {Object} IndexDocument
   * @property {string} index
   * @property {string} key
   * @property {object} doc
   * 
   * @param {IndexDocument}
   * @returns {Promise<Object>}
   */
  const indexDoc = ({index, key, doc}) => asyncFetch(`${config.origin}/${index}/_doc/${key}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(doc)
  })
    .chain(result => {
      if (result.status < 400) {
        return Async.fromPromise(result.json.bind(result))(result)
      } 
      return Async.Rejected({ok: false})
    })
    .map(r => ({ok: true}))
    .toPromise()


  /**
   * @typedef {Object} DocumentInfo
   * @property {string} index
   * @property {string} key
   * 
   * @param {DocumentInfo}
   * @returns {Promise<Object>}
   */
  const getDoc = ({index, key}) => asyncFetch(`${config.origin}/${index}/_doc/${key}/_source`, {
    headers
  }).chain(handleResponse(200))
    .map(result => { console.log(result); return result })
    .map(result => ({ok: true, key, doc: result}))
    .toPromise()


  /**
   * @param {IndexDocument}
   * @returns {Promise<Object>} 
   */
  const updateDoc = ({index, key, doc}) => asyncFetch(`${config.origin}/${index}/_doc/${key}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(doc)
  }).chain(handleResponse(200))
    .map(r => ({ok: true}))
    .toPromise()

  /**
   * @param {DocumentInfo}
   * @returns {Promise<Object>}
   */
  const removeDoc = ({index, key}) => asyncFetch(`${config.origin}/${index}/_doc/${key}`, {
    method: 'DELETE',
    headers
  }).chain(handleResponse(200))
    .map(r => ({ok: true}))
    .toPromise()
   
  /**
   * @typedef {Object} DocumentQuery
   * @property {string} index
   * @property {object} q
   * 
   * @param {DocumentQuery}
   * @returns {Promise<Object>}
   */
  const query = ({index, q}) => asyncFetch(`${config.origin}/${index}/_search`, {
    method: 'POST',
    headers,
    body: JSON.stringify(q)
  }).chain(handleResponse(200))
    .map(r => {
      return r
    })
    .map(r => ({ok: true, matches: pluck('_source', r.hits.hits)}))
  .toPromise()
  
  return Object.freeze({
    createIndex,
    deleteIndex,
    indexDoc,
    getDoc,
    updateDoc,
    removeDoc,
    query
  })
}