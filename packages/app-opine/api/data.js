
import { fork } from '../utils.js'

// GET /data
export const index = (_req, res) =>
  res.send({ name: 'hyper63 Data', version: '1.0.1', status: 'unstable' })

// PUT /data/:db
export const createDb = ({ params, data }, res) =>
  fork(res, 201, data.createDatabase(params.db))

// DELETE /data/:db
export const removeDb = ({ params, data }, res) =>
  fork(res, 200, data.destroyDatabase(params.db))

// GET /data/:db
export const listDocuments = ({ params, query, data }, res) =>
  fork(res, 200, data.listDocuments(params.db, query))

// POST /data/:db
export const createDocument = ({ params, body, data }, res) =>
  fork(res, 201, data.createDocument(params.db, body))

// GET /data/:db/:id
export const getDocument = ({ params, data }, res) =>
  fork(res, 200, data.getDocument(params.db, params.id))

// PUT /data/:db/:id
export const updateDocument = ({ data, params, body }, res) =>
  fork(res, 200, data.updateDocument(params.db, params.id, body))

// DELETE /data/:db/:id
export const deleteDocument = ({ data, params }, res) =>
  fork(res, 200, data.removeDocument(params.db, params.id))

// POST /data/:db/_query
export const queryDb = ({ data, params, body }, res) =>
  fork(res, 200, data.query(params.db, body))

// POST /data/:db/_index
export const indexDb = ({ data, params, body }, res) =>
  fork(res, 201, data.index(params.db, body.name, body.fields))

// POST /data/:db/_bulk
export const bulk = ({ data, params, body }, res) =>
  fork(res, 201, data.bulkDocuments(params.db, body))
