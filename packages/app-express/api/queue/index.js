const { fork } = require('../utils')

exports.index = (req, res) =>
  res.send({ name: 'hyper63 queue', version: '0.1', status: 'unstable' })

// PUT /queue/:name
exports.create = ({params, body, queue}, res) => 
  fork(res, 201, queue.create({name: params.name, target: body.target, secret: body.secret}))

// DELETE /queue/:name
exports['delete'] = ({params, queue }, res) =>
  fork(res, 201, queue.delete(params.name))

// POST /queue/:name
exports.post = ({params, body, queue }, res) =>
  fork(res, 201, queue.post({name: params.name, job: body}))

// GET /queue/:name?status=READY|ERROR
exports.list = ({params, query, queue}, res) =>
  fork(res, 200, queue.list({name: params.name, status: query.status}))

// POST /queue/:name/:id/_cancel
exports.cancel = ({params, queue}, res) =>
  fork(res, 201, queue.cancel({name: params.name, id: params.id}))
