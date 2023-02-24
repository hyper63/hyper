import { fork } from '../utils.js'

export const index = ({ queue }, res) =>
  fork(
    res,
    200,
    queue.index().map((queues) => ({
      name: 'queue',
      version: '0.0.4',
      queues,
    })),
  )

// PUT /queue/:name
export const create = ({ params, body, queue }, res) =>
  fork(
    res,
    201,
    queue.create({
      name: params.name,
      target: body.target,
      secret: body.secret,
    }),
  )

// DELETE /queue/:name
export const del = ({ params, queue }, res) => fork(res, 201, queue.delete(params.name))

// POST /queue/:name
export const post = ({ params, body, queue }, res) =>
  fork(res, 201, queue.post({ name: params.name, job: body }))

// GET /queue/:name?status=READY|ERROR
export const list = ({ params, query, queue }, res) =>
  fork(res, 200, queue.list({ name: params.name, status: query.status }))

// POST /queue/:name/:id/_cancel
export const cancel = ({ params, queue }, res) =>
  fork(res, 201, queue.cancel({ name: params.name, id: params.id }))
