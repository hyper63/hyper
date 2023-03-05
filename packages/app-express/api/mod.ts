import { R } from '../deps.ts'
import { HyperServices, Server } from '../types.ts'

import { data } from './data.ts'

const { when, compose } = R

export const mountServicesWith = (services: HyperServices) => (app: Server) => {
  const hasService = (service: keyof HyperServices) => !!services[service]

  return compose(
    // Add more as I implement them
    when(() => hasService('data'), data(services)),
  )(app)
}
