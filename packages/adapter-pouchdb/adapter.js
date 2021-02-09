const pouchdb = require('pouchdb')
const pouchdbFind = require('pouchdb-find')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const { Async } = require('crocks')
const { bichain } = require('crocks/pointfree')
const allow409 = require('./handle409')
const { assoc, compose, filter, identity, lens, map, merge, omit, over, pick, pluck, prop, propEq } = require('ramda')

const makedir = Async.fromPromise(mkdirp)
//const rmdir = Async.fromNode(fs.rmdir)
const rmrf = Async.fromNode(rimraf)

// add plugins
pouchdb.plugin(pouchdbFind)



/**
 * @typedef {Object} DataObject
 * @property {string} db
 * @property {string} id
 * @property {Object} doc
 * 
 * @typedef {Object} DataInfo
 * @property {string} db
 * @property {string} id
 * 
 * @typedef {Object} Response
 * @property {boolean} ok
 * @property {string} [msg]
 * 
 */

const getDbNames = compose(map(prop('name')), filter(propEq('type', 'db')), pluck('doc'), prop('rows'))

/**
 * @param {string} root - databases location
 */
module.exports = function (root) {
  if (!root) { throw new Error('root storage location required!') }

  // create master db to hold docs to databases
  const sys = pouchdb(`${root}/_system`)
  const databases = new Map()
  sys.allDocs({ include_docs: true })
    .then(getDbNames)
    // load databases
    .then(
      map(n => databases.set(n, pouchdb(`${root}/${n}`)))
    )
    .catch(e => console.log('ERROR: Could not get databases!'))

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function createDatabase(name) {
    if (!name) { return Promise.reject({ ok: false, msg: 'name is required!' }) }
    return makedir(path.resolve(root))
      .map(_ => pouchdb(
        path.resolve(`${root}/${name}`)
      ))

      // add to system database
      .chain(db =>
        // want to capture Reject and return Resolve if error is 409

        bichain(
          allow409,
          Async.Resolved,
          Async.fromPromise(sys.put.bind(sys))({ _id: name, type: 'db', name: name })
        )
          .map(() => db)
      )
      // set in Map
      .map(db => {
        databases.set(name, db)
        return { ok: true }
      })
      .toPromise()
  }

  /**
   * @param {string} name
   * @returns {Promise<Response>}
   */
  function removeDatabase(name) {
    if (!name) { return Promise.reject({ ok: false, msg: 'name is required!' }) }
    databases.delete(name)
    return rmrf(
      path.resolve(`${root}/${name}*`),
      { recursive: true }
    )
      .chain(_ => {
        const get = Async.fromPromise(sys.get)
        const remove = Async.fromPromise(sys.remove)
        return get(name).chain(remove)
      })
      .map(_ => ({ ok: true }))
      .toPromise()
  }

  /**
   * @param {DataObject}
   * @returns {Promise<Response>}
   */
  function createDocument({ db, id, doc }) {
    if (!db) { return Promise.reject({ ok: false, msg: 'dbname is required!' }) }
    if (!id) { return Promise.reject({ ok: false, msg: 'unique identifier is required!' }) }
    if (!doc) { return Promise.reject({ ok: false, msg: 'data document is required!' }) }

    const pouch = databases.get(db)
    if (!pouch) { return Promise.reject({ ok: false, msg: 'database not initalized!' }) }

    return pouch.put({
      _id: id,
      ...doc
    }).then(omit(['rev']))
  }

  /**
   * @param {DataInfo}
   * @returns {Promise<Response>}
   */
  function retrieveDocument({ db, id }) {
    if (!db) { return Promise.reject({ ok: false, msg: 'dbname is required!' }) }
    if (!id) { return Promise.reject({ ok: false, msg: 'unique identifier is required!' }) }

    const pouch = databases.get(db)
    if (!pouch) { return Promise.reject({ ok: false, msg: 'database not initalized!' }) }

    return pouch.get(id)
      .then(compose(
        omit(['_id', '_rev']),
        assoc('id', id)
      ))
    //.then(doc => ({ok: true, doc}))

  }

  /**
   * @param {DataObject}
   * @returns {Promise<Response>}
   */
  function updateDocument({ db, id, doc }) {
    if (!db) { return Promise.reject({ ok: false, msg: 'dbname is required!' }) }
    if (!id) { return Promise.reject({ ok: false, msg: 'unique identifier is required!' }) }
    if (!doc) { return Promise.reject({ ok: false, msg: 'data document is required!' }) }

    const pouch = databases.get(db)
    if (!pouch) { return Promise.reject({ ok: false, msg: 'database not initalized!' }) }

    return pouch.get(id)
      .then(pick(['_id', '_rev']))
      .then(merge(doc))
      .then(pouch.put.bind(pouch))
      .then(omit(['rev']))
  }

  /**
   * @param {DataInfo}
   * @returns {Promise<Response>}
   */
  function removeDocument({ db, id }) {
    if (!db) { return Promise.reject({ ok: false, msg: 'dbname is required!' }) }
    if (!id) { return Promise.reject({ ok: false, msg: 'unique identifier is required!' }) }

    const pouch = databases.get(db)
    if (!pouch) { return Promise.reject({ ok: false, msg: 'database not initalized!' }) }
    return pouch.get(id)
      .then(pouch.remove.bind(pouch))
  }

  /**
   * @typedef {Object} MangoQuery
   * @property {Object} selector
   * @property {Array[string]} [sort] - fields to sort by
   * @property {Number} [limit] - number of documents to return
   * @property {string} [use_index] - name of index to use
   * 
   * @typedef {Object} DataQuery
   * @property {string} db
   * @property {MangoQuery} query
   * 
   * @typedef {Object} ResponseDocs
   * @property {boolean} ok
   * @property {Array[Object]} docs
   * @property {string} [msg]
   */
  /**
   * @param {DataQuery}
   * @returns {Promise<ResponseDocs>}
   */
  function queryDocuments({ db, query }) {
    if (!db) { return Promise.reject({ ok: false, msg: 'dbname is required!' }) }
    if (!query) { return Promise.reject({ ok: false, msg: 'query is required!' }) }
    const xId = lens(prop('_id'), assoc('id'))

    const pouch = databases.get(db)
    if (!pouch) { return Promise.reject({ ok: false, msg: 'database not initalized!' }) }

    return pouch.find(query)
      .then(({ docs }) => {
        return ({
          ok: true,
          docs: map(
            compose(
              omit(['_id', '_rev']),
              over(xId, identity)
            ),
            docs
          )
        })
      })
  }

  /**
   * @typedef {Object} IndexInfo
   * @property {string} db
   * @property {string} name
   * @property {Array[string]} fields
   */

  /**
   * @param {IndexInfo}
   * @returns {Promise<Response>}
   */
  function indexDocuments({ db, name, fields }) {
    if (!db) { return Promise.reject({ ok: false, msg: 'dbname is required!' }) }
    if (!name) { return Promise.reject({ ok: false, msg: 'index name is required!' }) }
    if (!fields) { return Promise.reject({ ok: false, msg: 'fields for index is required!' }) }

    const pouch = databases.get(db)
    if (!pouch) { return Promise.reject({ ok: false, msg: 'database not initalized!' }) }
    return pouch.createIndex({ index: { fields }, ddoc: name })
      .then(result => ({ ok: true, msg: result.result }))
  }

  /**
   * @typedef {Object} DataList
   * @property {string} db
   * @property {number} [limit] - number of documents
   * @property {string} [startkey]
   * @property {string} [endkey]
   * @property {Array[string]} [keys]
   * @property {boolean} [descending]
   */
  /**
   * @param {DataList} 
   * @returns {Promise<Response>} 
   */
  function listDocuments({ db, limit, startkey, endkey, keys, descending }) {
    const pouch = databases.get(db)
    let options = { include_docs: true }
    const xid = lens(prop('_id'), assoc('id'))

    options = limit ? merge({ limit }, options) : options
    options = startkey ? merge({ startkey }, options) : options
    options = endkey ? merge({ endkey }, options) : options
    options = keys ? merge({ keys }, options) : options
    options = descending ? merge({ descending }, options) : options
    console.log({ options })
    return pouch.allDocs(options).then(results => {
      return ({
        ok: true,
        docs: map(
          compose(
            omit(['_rev', '_id']),
            over(xid, identity)
          ), pluck('doc', results.rows))
      })
    })
  }
  /**
   * @typedef {Object} BulkInput
   * @property {string} db
   * @property {Array<Object>} docs
   * 
   */
  /**
   * @param {BulkInput} 
   * @returns {Promise<object>}
   */
  // NEED to handle bulk PUTS which require revs

  function bulkDocuments({ db, docs }) {
    let pouch = databases.get(db)
    let lensId = lens(prop('id'), assoc('_id'))
    // find all documents that exist
    // update those with a rev
    // ignore docs that don't exist
    docs = map(
      compose(
        omit(['id']),
        over(lensId, identity)
      )
      , docs)
    return pouch.bulkDocs(docs)
      .then(docResults => {
        return {
          ok: true,
          results: map(omit(['rev']), docResults)
        }
      })
  }

  return Object.freeze({
    createDatabase,
    removeDatabase,
    createDocument,
    retrieveDocument,
    updateDocument,
    removeDocument,
    queryDocuments,
    indexDocuments,
    listDocuments,
    bulkDocuments
  })
}