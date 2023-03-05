import type { HyperServices, RouteHandler } from '../types.ts'

// middleware to inject core modules into request object
export const bindCore = (services: HyperServices): RouteHandler => (req, _res, next) => {
  req.cache = services.cache
  req.data = services.data
  req.storage = services.storage
  req.search = services.search
  req.events = services.events
  req.hooks = services.hooks
  req.queue = services.queue
  req.crawler = services.crawler
  next()
}
