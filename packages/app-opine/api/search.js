import { fork } from '../utils.js'

// GET /search
export const index = (_req, res) =>
  res.send({ name: 'hyper63 Search', version: '1.0', status: 'unstable' })

// PUT /search/:index
export const createIndex = ({ params, search, body }, res) =>
  fork(res, 201, search.createIndex(params.index, body))

// DELETE /search/:index
export const deleteIndex = ({ params, search }, res) =>
  fork(res, 200, search.deleteIndex(params.index))

// POST /search/:index
export const indexDoc = ({ params, body, search }, res) =>
  fork(res, 201, search.indexDoc(params.index, body.key, body.doc))

// GET /search/:index/:key
export const getDoc = ({ params, search }, res) =>
  fork(res, 200, search.getDoc(params.index, params.key))

// PUT /search/:index/:key
export const updateDoc = ({ search, params, body }, res) =>
  fork(res, 200, search.updateDoc(params.index, params.key, body))

// DELETE /search/:index/:key
export const removeDoc = ({ search, params }, res) =>
  fork(res, 200, search.removeDoc(params.index, params.key))

// POST /search/:index/_query
export const query = ({ search, params, body }, res) =>
  fork(res, 200, search.query(params.index, body))

// add bulk or batch
export const bulk = ({ search, params, body }, res) =>
  fork(res, 201, search.bulk(params.index, body))
