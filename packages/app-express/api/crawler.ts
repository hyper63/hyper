import { R } from '../deps.ts'
import { fork } from '../utils.ts'
import type { HyperServices, Server } from '../types.ts'
import { bindCore } from '../middleware/bindCore.ts'
import { json } from '../middleware/json.ts'

const { mergeRight } = R

type BucketParams = { bucket: string }
type NameParams = { name: string }

export const crawler = (services: HyperServices) => (app: Server) => {
  app.put<BucketParams & NameParams>(
    '/crawler/:bucket/:name',
    json(),
    bindCore(services),
    ({ crawler, params, body }, res) =>
      fork(
        res,
        201,
        crawler.upsert(
          mergeRight(body, { app: params.bucket, name: params.name }),
        ),
      ),
  )

  app.get<BucketParams & NameParams>(
    '/crawler/:bucket/:name',
    bindCore(services),
    ({ crawler, params }, res) => fork(res, 200, crawler.get(params.bucket, params.name)),
  )

  app.post<BucketParams & NameParams>(
    '/crawler/:bucket/:name/_start',
    bindCore(services),
    ({ crawler, params }, res) => fork(res, 200, crawler.start(params.bucket, params.name)),
  )

  //app.post('/crawler/:bucket/:name/_doc', json(), bindCore(services), crawler.post);

  app.delete<BucketParams & NameParams>(
    '/crawler/:bucket/:name',
    bindCore(services),
    ({ crawler, params }, res) => fork(res, 200, crawler.remove(params.bucket, params.name)),
  )

  return app
}
