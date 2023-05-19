import type { CrawlerPort } from '../../deps.ts'
import type { EventsManager } from '../../types.ts'

import * as c from './crawler.ts'
import * as job from './job.ts'

export default function ({
  crawler,
  events,
}: {
  crawler: CrawlerPort
  events: EventsManager
}) {
  /**
   * @param job
   */
  const upsert = (job: Parameters<CrawlerPort['upsert']>[0]) =>
    c.upsert(job).runWith({ svc: crawler, events })

  /**
   * @param app
   * @param name
   */
  const get = (app: string, name: string) => job.get(app, name).runWith({ svc: crawler, events })

  /**
   * @param app
   * @param name
   */
  const start = (app: string, name: string) =>
    job.start(app, name).runWith({ svc: crawler, events })

  /**
   * @param app
   * @param name
   */
  const remove = (app: string, name: string) =>
    c.remove(app, name).runWith({ svc: crawler, events })

  return Object.freeze({
    upsert,
    get,
    start,
    remove,
  })
}
