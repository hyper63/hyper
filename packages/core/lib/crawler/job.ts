import type { CrawlerPort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import { $logHyperErr, $resolveHyperErr, Async, AsyncReader, triggerEvent } from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

export const get = (app: string, name: string) =>
  of({ app, name })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CrawlerPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.get(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CRAWLER:GET_JOB'))

export const start = (app: string, name: string) =>
  of({ app, name })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<CrawlerPort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.start(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('CRAWLER:START_JOB'))
