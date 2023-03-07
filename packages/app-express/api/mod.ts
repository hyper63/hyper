import { R } from '../deps.ts'
import { HyperServices, Server } from '../types.ts'

import { data } from './data.ts'
import { cache } from './cache.ts'
import { crawler } from './crawler.ts'

const { when, compose } = R

export const mountServicesWith = (services: HyperServices) => (app: Server) => {
  const hasService = (service: keyof HyperServices) => !!services[service]

  return compose(
    // Add more as I implement them
    when(() => hasService('crawler'), crawler(services)),
    when(() => hasService('cache'), cache(services)),
    when(() => hasService('data'), data(services)),
  )(app)
}
