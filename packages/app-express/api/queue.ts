import { fork } from '../utils.ts'
import type { HyperServices, Server } from '../types.ts'
import { bindCore } from '../middleware/bindCore.ts'
import { json } from '../middleware/json.ts'

type NameParams = { name: string }
type IdParams = { id: string }

type QueueBody = {
  target: string
  secret?: string
}

type ListQuery = { status: 'READY' | 'ERROR' }

export const queue = (services: HyperServices) => (app: Server) => {
  app.get('/queue', bindCore(services), ({ queue }, res) =>
    fork(
      res,
      200,
      queue.index().map((queues: unknown) => ({
        name: 'queue',
        version: '0.0.4',
        queues,
      })),
    ))

  // deno-lint-ignore no-explicit-any
  app.put<NameParams, any, QueueBody>(
    '/queue/:name',
    json(),
    bindCore(services),
    ({ params, body, queue }, res) =>
      fork(
        res,
        201,
        queue.create({
          name: params.name,
          target: body.target,
          secret: body.secret,
        }),
      ),
  )

  app.delete<NameParams>(
    '/queue/:name',
    bindCore(services),
    ({ params, queue }, res) => fork(res, 201, queue.delete(params.name)),
  )

  // deno-lint-ignore no-explicit-any
  app.post<NameParams, any, Record<string, unknown>>(
    '/queue/:name',
    json(),
    bindCore(services),
    ({ params, body, queue }, res) => fork(res, 201, queue.post({ name: params.name, job: body })),
  )

  // deno-lint-ignore no-explicit-any
  app.get<NameParams, any, unknown, ListQuery>(
    '/queue/:name',
    bindCore(services),
    ({ params, query, queue }, res) =>
      fork(res, 200, queue.list({ name: params.name, status: query.status })),
  )

  app.post<NameParams & IdParams>(
    '/queue/:name/:id/_cancel',
    bindCore(services),
    ({ params, queue }, res) => fork(res, 201, queue.cancel({ name: params.name, id: params.id })),
  )

  // TODO: do we need to expose retry?

  return app
}
