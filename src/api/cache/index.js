const { fork } = require("../utils");

// GET /cache
exports.index = (req, res) =>
  res.send({ name: "Atlas Cache", version: "1.0", status: "unstable" });

// PUT /cache/:name
exports.createStore = ({ params, cache }, res) =>
  fork(res, 201, cache.createStore(params.name));

// DELETE /cache/:name
exports.deleteStore = ({ params, cache }, res) =>
  fork(res, 200, cache.deleteStore(params.name));

// POST /cache/:name/:key?ttl=1hr
exports.createDocument = ({ params, query, body, cache }, res) =>
  fork(res, 201, cache.createDoc(params.name, body.key, body.doc, query.ttl));

// GET /cache/:name/:key
exports.getDocument = ({ params, cache }, res) =>
  fork(res, 200, cache.getDoc(params.name, params.key));

// PUT /cache/:name/:key
exports.updateDocument = ({ cache, params, body }, res) =>
  fork(res, 200, cache.updateDoc(params.name, params.key, body));

// DELETE /cache/:name/:key
exports.deleteDocument = ({ cache, params }, res) =>
  fork(res, 200, cache.deleteDoc(params.name, params.key));
