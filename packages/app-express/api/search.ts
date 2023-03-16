import { fork } from '../utils.ts'
import type { HyperServices, Server } from '../types.ts'
import { bindCore } from '../middleware/bindCore.ts'
import { json } from '../middleware/json.ts'

type IndexParams = { index: string }
type KeyParams = { key: string }

type IndexBody = {
  fields: string[]
  storeFields?: string[]
}

type QueryBody = {
  query: string
  fields?: string[]
  filter?: Record<string, unknown>
}

type SearchDoc = ({ id: string } | { _id: string }) & Record<string, unknown>

export const search = (services: HyperServices) => (app: Server) => {
  app.get(
    '/search',
    (_req, res) => res.send({ name: 'hyper63 Search', version: '1.0', status: 'unstable' }),
  )

  // deno-lint-ignore no-explicit-any
  app.put<IndexParams, any, IndexBody>(
    '/search/:index',
    json(),
    bindCore(services),
    ({ params, search, body }, res) => fork(res, 201, search.createIndex(params.index, body)),
  )

  app.delete<IndexParams>(
    '/search/:index',
    bindCore(services),
    ({ params, search }, res) => fork(res, 200, search.deleteIndex(params.index)),
  )

  // deno-lint-ignore no-explicit-any
  app.post<IndexParams, any, { key: string; doc: Record<string, unknown> }>(
    '/search/:index',
    json(),
    bindCore(services),
    ({ params, body, search }, res) =>
      fork(res, 201, search.indexDoc(params.index, body.key, body.doc)),
  )

  app.get<IndexParams & KeyParams>(
    '/search/:index/:key',
    bindCore(services),
    ({ params, search }, res) => fork(res, 200, search.getDoc(params.index, params.key)),
  )

  // deno-lint-ignore no-explicit-any
  app.put<IndexParams & KeyParams, any, Record<string, unknown>>(
    '/search/:index/:key',
    json(),
    bindCore(services),
    ({ search, params, body }, res) =>
      fork(res, 200, search.updateDoc(params.index, params.key, body)),
  )

  app.delete<IndexParams & KeyParams>(
    '/search/:index/:key',
    bindCore(services),
    ({ search, params }, res) => fork(res, 200, search.removeDoc(params.index, params.key)),
  )

  // deno-lint-ignore no-explicit-any
  app.post<IndexParams, any, QueryBody>(
    '/search/:index/_query',
    json(),
    bindCore(services),
    ({ search, params, body }, res) => fork(res, 200, search.query(params.index, body)),
  )

  // deno-lint-ignore no-explicit-any
  app.post<IndexParams, any, SearchDoc[]>(
    '/search/:index/_bulk',
    json(),
    bindCore(services),
    ({ search, params, body }, res) => fork(res, 201, search.bulk(params.index, body)),
  )

  return app
}
