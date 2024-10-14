import { R } from '../deps.ts'
import type { HyperServices, Server } from '../types.ts'

import { data } from './data.ts'
import { cache } from './cache.ts'
import { search } from './search.ts'
import { storage } from './storage.ts'
import { queue } from './queue.ts'
import { crawler } from './crawler.ts'

const { when, compose } = R

export const withCoreServicesRoutes = (services: HyperServices) => (app: Server) => {
  const hasService = (service: keyof HyperServices) => !!services[service]

  return compose(
    when(() => hasService('crawler'), crawler(services)),
    when(() => hasService('queue'), queue(services)),
    when(() => hasService('storage'), storage(services)),
    when(() => hasService('search'), search(services)),
    when(() => hasService('cache'), cache(services)),
    when(() => hasService('data'), data(services)),
  )(app)
}
