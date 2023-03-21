import { fork } from '../utils.ts'
import type { HyperServices, Server } from '../types.ts'
import { bindCore } from '../middleware/bindCore.ts'

type NameParams = { name: string }

export const storage = (services: HyperServices) => (app: Server) => {
  app.get(
    '/storage',
    (_req, res) => res.send({ name: 'hyper63 Storage', version: '1.0', status: 'unstable' }),
  )

  app.put<NameParams>(
    '/storage/:name',
    bindCore(services),
    ({ params, storage }, res) => fork(res, 201, storage.makeBucket(params.name)),
  )

  app.delete<NameParams>(
    '/storage/:name',
    bindCore(services),
    ({ params, storage }, res) => fork(res, 201, storage.removeBucket(params.name)),
  )

  app.delete(
    '/storage/:name/*',
    bindCore(services),
    ({ params, storage }, res) => fork(res, 201, storage.removeObject(params.name, params[0])),
  )

  return app
}
