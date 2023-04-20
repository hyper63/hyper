import type { QueuePort } from '../../deps.ts'
import type { EventsManager } from '../../types.ts'

import * as q from './queue.ts'
import * as job from './job.ts'

export default function ({
  queue,
  events,
}: {
  queue: QueuePort
  events: EventsManager
}) {
  return Object.freeze({
    index: () => q.index().runWith({ svc: queue, events }),
    /**
     * @param input
     */
    create: (input: Parameters<QueuePort['create']>[0]) =>
      q.create(input).runWith({ svc: queue, events }),
    /**
     * @param name
     */
    delete: (name: string) => q.del(name).runWith({ svc: queue, events }),
    /**
     * @param input
     */
    list: (input: Parameters<QueuePort['get']>[0]) => q.list(input).runWith({ svc: queue, events }),
    /**
     * @param input
     */
    post: (input: Parameters<QueuePort['post']>[0]) =>
      job.post(input).runWith({ svc: queue, events }),
    /**
     * @param input
     */
    cancel: (input: Parameters<QueuePort['cancel']>[0]) =>
      job.cancel(input).runWith({ svc: queue, events }),
  })
}
