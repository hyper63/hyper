const { fork } = require('../utils')
// GET /data
exports.index = (req, res) =>
  res.send({ name: "hyper63 Data", version: "1.0", status: "unstable" });

// PUT /data/:db
exports.createDb = ({ params, data }, res) =>
  fork(res, 201, data.createDatabase(params.db));

// DELETE /data/:db
exports.removeDb = ({ params, data }, res) =>
  fork(res, 200, data.destroyDatabase(params.db));

// GET /data/:db
exports.listDocuments = ({ params, query, data }, res) =>
  fork(res, 200, data.listDocuments(params.db, query))

// POST /data/:db
exports.createDocument = ({ params, body, data }, res) =>
  fork(res, 201, data.createDocument(params.db, body));

// GET /data/:db/:id
exports.getDocument = ({ params, data }, res) =>
  fork(res, 200, data.getDocument(params.db, params.id));

// PUT /data/:db/:id
exports.updateDocument = ({ data, params, body }, res) =>
  fork(res, 200, data.updateDocument(params.db, params.id, body));

// DELETE /data/:db/:id
exports.deleteDocument = ({ data, params }, res) =>
  fork(res, 200, data.removeDocument(params.db, params.id));

// POST /data/:db/_query
exports.queryDb = ({ data, params, body }, res) =>
  fork(res, 200, data.query(params.db, body));

// POST /data/:db/_index
exports.indexDb = ({data, params, body}, res) => 
  fork(res, 201, data.index(params.db, body.name, body.fields));
