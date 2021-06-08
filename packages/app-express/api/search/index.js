const { fork } = require('../utils')

// GET /search
exports.index = (req, res) =>
  res.send({ name: 'hyper63 Search', version: '1.0', status: 'unstable' })

// PUT /search/:index
exports.createIndex = ({ params, search, body }, res) =>
  fork(res, 201, search.createIndex(params.index, body))

// DELETE /search/:index
exports.deleteIndex = ({ params, search }, res) =>
  fork(res, 200, search.deleteIndex(params.index))

// POST /search/:index
exports.indexDoc = ({ params, body, search }, res) =>
  fork(res, 201, search.indexDoc(params.index, body.key, body.doc))

// GET /search/:index/:key
exports.getDoc = ({ params, search }, res) =>
  fork(res, 200, search.getDoc(params.index, params.key))

// PUT /search/:index/:key
exports.updateDoc = ({ search, params, body }, res) =>
  fork(res, 200, search.updateDoc(params.index, params.key, body))

// DELETE /search/:index/:key
exports.removeDoc = ({ search, params }, res) =>
  fork(res, 200, search.removeDoc(params.index, params.key))

// POST /search/:index/_query
exports.query = ({ search, params, body }, res) =>
  fork(res, 200, search.query(params.index, body))

// add bulk or batch
exports.bulk = ({ search, params, body }, res) =>
  fork(res, 201, search.bulk(params.index, body))
