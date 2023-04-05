// deno-lint-ignore-file no-explicit-any
import { isHyperErr, R } from './deps.ts'

import type { HttpResponse } from './types.ts'

const { pick } = R

interface HyperResponse {
  ok: boolean
  status?: number
  msg?: string
  [key: string]: any
}

export type Forkable<R = any, L = any> = {
  fork: (left: (err: L) => any, right: (res: R) => any) => void
}

const sanitizeErr = pick(['ok', 'status', 'msg'])

const isProduction = () => {
  const env = Deno.env.get('DENO_ENV')
  // Default to production behavior if no DENO_ENV is set
  return !env || env === 'production'
}

/**
 * See https://github.com/hyper63/hyper/issues/470
 * for strategy
 */
export const fork = <R extends HyperResponse, L = any>(
  res: HttpResponse,
  code = 200,
  m: Forkable<R, L>,
  isIterable = false,
) =>
  m.fork(
    (err) => {
      console.log('fatal error received from core')
      console.log(err)
      res.status(500).send(isProduction() ? 'Internal Server Error' : err)
    },
    async (serviceResult) => {
      if (isHyperErr(serviceResult)) {
        /**
         * Use status in HyperError and fallback to 500
         *
         * Conditionally sanitize the results
         */
        return res
          .status(serviceResult.status || 500)
          .send(isProduction() ? sanitizeErr(serviceResult) : serviceResult)
      }

      /**
       * The result is an Iterable ie. a ReadableStream
       * and so should be written in chunks to the Response
       * object.
       *
       * Once all chunks are written to Response,
       * we call end() to instruct the server to consider
       * this response "done"
       */
      if (isIterable) {
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        for await (const chunk of serviceResult) {
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          res.write(chunk)
        }
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        return res.status(code).end()
      }

      res.status(code).send(serviceResult)
    },
  )

export const isMultipartFormData = (contentType = '') => {
  return contentType.startsWith('multipart/form-data')
}

export const isFile = (path: string) => {
  path = path || '/'
  return (path.split('/').pop()?.indexOf('.') || 0) > -1
}

/**
 * Add an empty string to coerce val to
 * a string, then compare to string 'true'
 */
export const isTrue = (val: unknown) => (val + '').trim() === 'true'
