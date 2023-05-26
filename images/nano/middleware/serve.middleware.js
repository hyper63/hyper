import { contentType } from 'https://deno.land/std@0.189.0/media_types/mod.ts'
import { Status, STATUS_TEXT } from 'https://deno.land/std@0.189.0/http/mod.ts'
import * as Colors from 'https://deno.land/std@0.189.0/fmt/colors.ts'

import { isHyperErr } from 'https://raw.githubusercontent.com/hyper63/hyper/hyper-utils%40v0.1.1/packages/utils/hyper-err.js'

/**
 * Don't allow bucket names that match hyper services
 */
const UNALLOWED = ['data', 'cache', 'search', 'storage', 'queue', 'crawler']

const info = (text, ...rest) => console.log(`${Colors.blue('[INFO]')} ${text}`, ...rest)
const error = (text = '', ...rest) =>
  console.log(`${Colors.red('[ERROR]')} ${text.toString()}`, ...rest)

const noop = () => {}

/**
 * TODO:
 * - Add in-memory cache of objects (LRU?)
 *   - cache streams contents of streams?
 * - Send cache headers for CDNs to leverage
 */
export function serve(buckets = []) {
  if (!buckets.length) throw new Error('At least one bucket name is required')

  if (buckets.filter((b) => UNALLOWED.includes(b)).length) {
    throw new Error(`bucket names cannot be one of: [${UNALLOWED.join(', ')}]`)
  }

  return (app, { storage }) => {
    /**
     * For each bucket, add a route that will serve
     * the contents of each bucket
     */
    buckets.forEach((bucket) => {
      info(`Adding route to serve contents of bucket '${Colors.blue(bucket)}'`)

      /**
       * Root internally forwards to index.html
       */
      app.get(`/${bucket}`, (req, res, next) => {
        req.url = `/${bucket}/index.html`
        app._router.handle(req, res, next)
      })
      app.get(`/${bucket}/*`, ({ params }, res) => {
        /**
         * If no path, assume fetching index.html
         */
        const object = params[0] || 'index.html'
        /**
         * If no extension assume, fetching an html object
         */
        const extension = object.split('.').pop() || 'html'

        storage
          /**
           * Always receive a stream from core
           * by pass 'false' for useSignedUrl
           */
          .getObject(bucket, object, false)
          .bimap(
            (err) => {
              error('fatal error received from core', err)
              res.status(Status.InternalServerError).send('Internal Server Error')
            },
            async (result) => {
              /**
               * A hyper error is simply returned as JSON
               */
              if (isHyperErr(result)) {
                const status = result.status || 500
                return res.status(status).send(result.msg || STATUS_TEXT[status])
              }

              /**
               * Get mime type based on the object file extension in the url
               * and default to octet-stream if the content type is unknown
               */
              res.set({ 'Content-Type': contentType(extension) || 'application/octet-stream' })

              for await (const chunk of result) res.write(chunk)
              return res.status(Status.OK).end()
            },
          ).fork(noop, noop)
      })
    })

    return app
  }
}
