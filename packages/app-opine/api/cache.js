import { fork } from '../utils.js';

// GET /cache
export const index = ({ cache }, res) =>
  fork(
    res,
    200,
    cache.index().map((stores) => ({
      name: 'cache',
      version: '0.0.4',
      stores,
    })),
  );

// PUT /cache/:name
export const createStore = ({ params, cache }, res) =>
  fork(res, 201, cache.createStore(params.name));

// DELETE /cache/:name
export const deleteStore = ({ params, cache }, res) =>
  fork(res, 200, cache.deleteStore(params.name));

// POST /cache/:name/:key?ttl=1hr
export const createDocument = ({ params, body, cache }, res) =>
  fork(res, 201, cache.createDoc(params.name, body.key, body.value, body.ttl));

// GET /cache/:name/:key
export const getDocument = ({ params, isLegacyGetEnabled, cache }, res) =>
  fork(res, 200, cache.getDoc(params.name, params.key, isLegacyGetEnabled));

// PUT /cache/:name/:key
export const updateDocument = ({ cache, params, body, query }, res) =>
  fork(res, 200, cache.updateDoc(params.name, params.key, body, query.ttl));

// DELETE /cache/:name/:key
export const deleteDocument = ({ cache, params }, res) =>
  fork(res, 200, cache.deleteDoc(params.name, params.key));

// POST /cache/:name/_query
export const queryStore = ({ cache, params, query }, res) =>
  fork(res, 200, cache.queryStore(params.name, query.pattern));
