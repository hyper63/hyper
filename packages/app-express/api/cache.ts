import { fork } from '../utils.ts'
import type { HyperServices, Server } from '../types.ts'
import { bindCore } from '../middleware/bindCore.ts'
import { json } from '../middleware/json.ts'
import { legacyGet } from '../middleware/legacyGet.ts'

type NameParams = { name: string }
type KeyParams = { key: string }
type PatternQuery = { pattern: string }
type Ttl = { ttl?: string }

type CreateDocBody = { key: string; value: Record<string, unknown> } & Ttl

export const cache = (services: HyperServices) => (app: Server) => {
  app.get('/cache', bindCore(services), ({ cache }, res) =>
    fork(
      res,
      200,
      // deno-lint-ignore no-explicit-any
      cache.index().map((stores: any) => ({
        name: 'cache',
        version: '0.0.4',
        stores,
      })),
    ))

  app.put<NameParams>(
    '/cache/:name',
    bindCore(services),
    ({ params, cache }, res) => fork(res, 201, cache.createStore(params.name)),
  )

  app.delete<NameParams>(
    '/cache/:name',
    bindCore(services),
    ({ params, cache }, res) => fork(res, 200, cache.deleteStore(params.name)),
  )

  // deno-lint-ignore no-explicit-any
  app.get<NameParams, any, unknown, PatternQuery>(
    '/cache/:name/_query',
    bindCore(services),
    ({ cache, params, query }, res) => fork(res, 200, cache.queryStore(params.name, query.pattern)),
  )

  // deno-lint-ignore no-explicit-any
  app.post<NameParams, any, unknown, PatternQuery>(
    '/cache/:name/_query',
    bindCore(services),
    ({ cache, params, query }, res) => fork(res, 200, cache.queryStore(params.name, query.pattern)),
  )

  // deno-lint-ignore no-explicit-any
  app.post<NameParams, any, CreateDocBody>(
    '/cache/:name',
    json(),
    bindCore(services),
    ({ params, body, cache }, res) =>
      fork(
        res,
        201,
        cache.createDoc(params.name, body.key, body.value, body.ttl),
      ),
  )

  app.get<NameParams & KeyParams>(
    '/cache/:name/:key',
    bindCore(services),
    legacyGet,
    ({ params, isLegacyGetEnabled, cache }, res) =>
      fork(res, 200, cache.getDoc(params.name, params.key, isLegacyGetEnabled)),
  )

  // deno-lint-ignore no-explicit-any
  app.put<NameParams & KeyParams, any, Record<string, unknown>, Ttl>(
    '/cache/:name/:key',
    json(),
    bindCore(services),
    ({ cache, params, body, query }, res) =>
      fork(res, 200, cache.updateDoc(params.name, params.key, body, query.ttl)),
  )

  app.delete<NameParams & KeyParams>(
    '/cache/:name/:key',
    bindCore(services),
    ({ cache, params }, res) => fork(res, 200, cache.deleteDoc(params.name, params.key)),
  )

  return app
}
