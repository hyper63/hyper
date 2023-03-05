// deno-lint-ignore-file no-explicit-any

/**
 * express, and EVEN the types, should not
 * be referenced anywhere outside of this types file, deps.ts
 * and mod.ts
 */
import { type express } from './deps.ts'

/**
 * TODO: fill out with types implemented by core
 * when they are available
 */
export interface HyperServices {
  data: any
  cache: any
  search: any
  storage: any
  queue: any
  hooks: any
  crawler: any
  events: any
  middleware?: any[]
}

declare global {
  namespace Express {
    export interface Request extends HyperServices {
      isLegacyGetEnabled?: boolean
    }
  }
}

export type Server = express.Express

export type HttpRequest = express.Request
export type HttpResponse = express.Response

export type RouteHandler = (
  req: HttpRequest,
  res: HttpResponse,
  next: express.NextFunction,
) => void

export type ErrorRouteHandler = (
  err: any,
  req: HttpRequest,
  res: HttpResponse,
  next: express.NextFunction,
) => void
