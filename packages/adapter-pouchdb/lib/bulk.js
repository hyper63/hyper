const { assoc, compose, find, filter, identity, has, is, isNil, lens, map, omit, over, path, pluck, prop } = require('ramda')
const { Async } = require('crocks')

/**
 *
 * @typedef {Object} BulkInput
 * @property {string} db
 * @property {Array<Object>} docs
 *
 */
const lensId = lens(prop('id'), assoc('_id'))
const lensRev = lens(path(['value', 'rev']), assoc('rev'))
const xRevs = map(
  compose(
    omit(['key', 'value']),
    over(lensRev, identity)
  )
)

const switchIds = map(
  compose(
    omit(['id']),
    over(lensId, identity)
  )
)

const pluckIds = pluck('id')
const getDocsThatExist = pouch => ids =>
  Async.fromPromise(pouch.allDocs.bind(pouch))({
    keys: ids
  })
    .map(prop('rows'))
    .map(filter(has('value')))
    .map(xRevs)

const mergeWithRevs = docs => revs =>
  map(doc => {
    const rev = find(rev => doc.id === rev.id, revs)
    return rev ? { _rev: rev.rev, ...doc } : doc
  }, docs)

const applyBulkDocs = pouch =>
  Async.fromPromise(pouch.bulkDocs.bind(pouch))

/**
 * @param {BulkInput}
 * @returns {Promise<object>}
 */
// NEED to handle bulk PUTS which require revs
const bulkDocuments = databases => ({ db, docs }) => {
  if (isNil(db)) {
    return Promise.reject({ ok: false, msg: 'db not defined' })
  }
  const pouch = databases.get(db)

  if (isNil(pouch)) {
    return Promise.reject({ ok: false, msg: 'db not found' })
  }

  if (docs && !is(Object, docs[0])) {
    return Promise.reject({ ok: false, msg: 'documents must be objects' })
  }
  return Async.of(docs)
    // validate that the docs have an id
    // maybe reject if they don't?
    .map(pluckIds)
    .chain(getDocsThatExist(pouch))
    .map(mergeWithRevs(docs))
    .map(switchIds)
    .chain(applyBulkDocs(pouch))
    .map(map(omit(['rev'])))
    .map(docResults => ({ ok: true, results: docResults }))
    .toPromise()
}

module.exports = bulkDocuments
