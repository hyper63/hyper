const pouchdb = require('pouchdb')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const { Async } = require('crocks')
const { assoc, compose, omit, pick, merge } = require('ramda')

const makedir = Async.fromPromise(mkdirp)
//const rmdir = Async.fromNode(fs.rmdir)
const rmrf = Async.fromNode(rimraf)

/**
 * @param {string} root - databases location
 */
module.exports = function (root) {
  const databases = new Map()
  
  function createDatabase(name) {
    return makedir(path.resolve(root))
      .map(_ => pouchdb(
        path.resolve(`${root}/${name}`)
      ))
      .map(db => {
        databases.set(name, db)
        return {ok: true}
      })
      .toPromise()
  }

  function removeDatabase(name) {
    databases.delete(name)
    return rmrf(
      path.resolve(`${root}/${name}`),
      { recursive: true}
    )
    .map(_ => ({ok: true}))
    .toPromise()
  }

  function createDocument({ db, id, doc }) {
    const pouch = databases.get(db)
    
    return pouch.put({
      _id: id,
      ...doc
    }).then(omit(['rev']))
  }
  
  function retrieveDocument({db, id}) {
    const pouch = databases.get(db)
    return pouch.get(id)
      .then(compose(
        omit(['_id', '_rev']),
        assoc('id', id)
      ))

  }

  function updateDocument({db, id, doc}) {
    const pouch = databases.get(db)
    return pouch.get(id)
      .then(pick(['_id', '_rev']))
      .then(merge(doc))
      .then(pouch.put.bind(pouch))
      .then(omit(['rev']))
  }

  function removeDocument({db, id}) {
    const pouch = databases.get(db)
    return pouch.get(id)
      .then(pouch.remove.bind(pouch))

  }
  return Object.freeze({
    createDatabase,
    removeDatabase,
    createDocument,
    retrieveDocument,
    updateDocument,
    removeDocument
  })
}