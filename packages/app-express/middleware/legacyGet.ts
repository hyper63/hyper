import { isTrue } from '../utils.ts'
import type { RouteHandler } from '../types.ts'

export const legacyGet: RouteHandler = (req, _res, next) => {
  if (!req.get('X-HYPER-LEGACY-GET')) return next()
  req.isLegacyGetEnabled = isTrue(req.get('X-HYPER-LEGACY-GET'))
  next()
}

declare global {
  namespace Express {
    export interface Request {
      isLegacyGetEnabled?: boolean
    }
  }
}
