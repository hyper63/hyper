import type { CrawlerPort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import { $logHyperErr, $resolveHyperErr, Async, AsyncReader, triggerEvent } from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

export const upsert = (job: Parameters<CrawlerPort['upsert']>[0]) =>
  of(job)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CrawlerPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.upsert(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CRAWLER:UPSERT_JOB'))

export const remove = (app: string, name: string) =>
  of({ app, name })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CrawlerPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.delete(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CRAWLER:DELETE_JOB'))
