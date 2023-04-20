import { type QueuePort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import { $logHyperErr, $resolveHyperErr, Async, AsyncReader, triggerEvent } from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

export const post = (input: Parameters<QueuePort['post']>[0]) =>
  of(input)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<QueuePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.post(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('QUEUE:POST'))

export const cancel = (input: Parameters<QueuePort['cancel']>[0]) =>
  of(input)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<QueuePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.cancel(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('QUEUE:CANCEL'))
