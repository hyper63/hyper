import { fork } from '../utils.ts'
import type { HyperServices, Server } from '../types.ts'
import { bindCore } from '../middleware/bindCore.ts'
import { json } from '../middleware/json.ts'
import { legacyGet } from '../middleware/legacyGet.ts'

type DbParams = { db: string }
type IdParams = { id: string }

export const data = (services: HyperServices) => (app: Server) => {
  app.get(
    '/data',
    (_req, res) => res.send({ name: 'hyper Data', version: '1.0.1', status: 'unstable' }),
  )

  // Database
  app.put<DbParams>(
    '/data/:db',
    bindCore(services),
    ({ params, data }, res) => fork(res, 201, data.createDatabase(params.db)),
  )

  app.delete<DbParams>(
    '/data/:db',
    bindCore(services),
    ({ params, data }, res) => fork(res, 200, data.destroyDatabase(params.db)),
  )

  // Documents
  app.get<DbParams>(
    '/data/:db',
    bindCore(services),
    ({ params, query, data }, res) => fork(res, 200, data.listDocuments(params.db, query)),
  )

  app.post<DbParams>(
    '/data/:db',
    json({ limit: '8mb' }),
    bindCore(services),
    ({ params, body, data }, res) => fork(res, 201, data.createDocument(params.db, body)),
  )

  app.get<DbParams & IdParams>(
    '/data/:db/:id',
    bindCore(services),
    legacyGet,
    ({ params, isLegacyGetEnabled, data }, res) =>
      fork(res, 200, data.getDocument(params.db, params.id, isLegacyGetEnabled)),
  )

  app.put<DbParams & IdParams>(
    '/data/:db/:id',
    json({ limit: '8mb' }),
    bindCore(services),
    ({ data, params, body }, res) =>
      fork(res, 200, data.updateDocument(params.db, params.id, body)),
  )

  app.delete<DbParams & IdParams>(
    '/data/:db/:id',
    bindCore,
    ({ data, params }, res) => fork(res, 200, data.removeDocument(params.db, params.id)),
  )

  app.post<DbParams>(
    '/data/:db/_query',
    json(),
    bindCore(services),
    ({ data, params, body }, res) => fork(res, 200, data.query(params.db, body)),
  )

  app.post<DbParams>(
    '/data/:db/_index',
    json(),
    bindCore(services),
    ({ data, params, body }, res) => fork(res, 201, data.index(params.db, body.name, body.fields)),
  )

  app.post<DbParams>(
    '/data/:db/_bulk',
    json(),
    bindCore(services),
    ({ data, params, body }, res) => fork(res, 201, data.bulkDocuments(params.db, body)),
  )

  return app
}
