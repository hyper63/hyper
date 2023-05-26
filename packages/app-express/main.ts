import { mountServicesWith } from './api/mod.ts'
import { cors, express, helmet } from './deps.ts'
import type { ErrorRouteHandler, HyperServices, Server } from './types.ts'

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
  const mountServices = mountServicesWith(services)

  let app = express()

  app.use(helmet())
  app.use(cors({ credentials: true }))

  if (services.middleware?.length) {
    app = services.middleware
      .reverse()
      .reduce(
        (app, middleware) => middleware(app, services),
        app,
      )
  }

  app = mountServices(app)

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

  // Error Handler
  app.use(errorHandler)

  // Handle fall through case, if not handled above then return 404
  app.use((_req, res) => {
    res.status(404).json({ ok: false, msg: 'not found!' })
  })

  return app
}
