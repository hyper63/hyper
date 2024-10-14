import { cors, express, helmet, R } from './deps.ts'
import { withCoreServicesRoutes } from './api/mod.ts'
import type { ErrorRouteHandler, HyperServices, Server } from './types.ts'

const { pipe } = R

// All of these args need to be specified, or it won't be invoked on error
const errorHandler: ErrorRouteHandler = (err, _req, res, _next) => {
  if (err) {
    console.log(
      JSON.stringify({
        type: 'ERROR',
        date: new Date().toISOString(),
        payload: err.message,
      }),
    )
    res.status(500).json({ ok: false, status: 500, msg: err.message })
  }
}

export function main(services: HyperServices): Server {
  return pipe(
    /**
     * Apply base layer middleware
     */
    (app) => app.use(helmet()),
    (app) => app.use(cors({ credentials: true })),
    /**
     * Apply middleware to the app
     */
    (app) => {
      if (!services.middleware?.length) return app

      return services.middleware
        .reverse()
        .reduce(
          (app, middleware) => middleware(app, services),
          app,
        )
    },
    /**
     * Apply hyper core services routes
     */
    withCoreServicesRoutes(services),
    /**
     * Apply root route
     */
    (app) => {
      app.get('/', (_req, res) => {
        res.json({
          name: 'hyper',
          version: '1.0-beta',
          services: Object.keys(services)
            .filter((k) => k !== 'events')
            .filter((k) => k !== 'middleware')
            .filter((k) => k !== 'hooks')
            .filter((k) => services[k as keyof HyperServices] !== null),
        })
      })

      return app
    },
    (app) => app.use(errorHandler),
    (app) =>
      app.use((_req, res) => {
        res.status(404).json({ ok: false, msg: 'not found!' })
      }),
  )(express())
}
