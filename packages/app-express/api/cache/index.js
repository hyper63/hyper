const { fork } = require('../utils')

// GET /cache
exports.index = (req, res) =>
  res.send({ name: "hyper63 Cache", version: "1.0", status: "unstable" });

// PUT /cache/:name
exports.createStore = ({ params, cache }, res) =>
  fork(res, 201, cache.createStore(params.name));

// DELETE /cache/:name
exports.deleteStore = ({ params, cache }, res) =>
  fork(res, 200, cache.deleteStore(params.name));

// POST /cache/:name/:key?ttl=1hr
exports.createDocument = ({ params, body, cache }, res) =>
  fork(res, 201, cache.createDoc(params.name, body.key, body.value, body.ttl));

// GET /cache/:name/:key
exports.getDocument = ({ params, cache }, res) =>
  fork(res, 200, cache.getDoc(params.name, params.key));

// PUT /cache/:name/:key
exports.updateDocument = ({ cache, params, body, query }, res) =>
  fork(res, 200, cache.updateDoc(params.name, params.key, body, query.ttl));

// DELETE /cache/:name/:key
exports.deleteDocument = ({ cache, params }, res) =>
  fork(res, 200, cache.deleteDoc(params.name, params.key));

// POST /cache/:name/_query
exports.queryStore = ({ cache, params, query }, res) =>
  fork(res, 200, cache.queryStore(params.name, query.pattern));
