import {
  getMimeType,
  isHyperErr,
  readableStreamFromIterable,
  readableStreamFromReader,
} from '../deps.ts'
import { fork, isFile, isTrue } from '../utils.ts'
import type { HttpResponse, HyperServices, Server, UploadedFile } from '../types.ts'
import { bindCore } from '../middleware/bindCore.ts'
import { formData, objectBodyParser } from '../middleware/object.ts'

type NameParams = { name: string; 0?: string }

async function formDataObject({
  params,
  file,
  path,
  storage,
  res,
}: {
  params: NameParams
  file?: UploadedFile
  path: string | undefined
  storage: HyperServices['storage']
  res: HttpResponse
}) {
  if (!file) {
    return res.status(422).json({
      ok: false,
      status: 422,
      msg: 'body must be FormData that contains a file field and optional path field',
    })
  }

  const bucket = params.name
  // object is placed at root of bucket, by default
  let object = file.originalname
  const useSignedUrl = false
  /**
   * object can be placed in "subdirectories" within the bucket
   *
   * If a path is provided in the formData,
   * combine with object to create the full object path
   * to be passed to core
   *
   * From multer:
   *   req.body will hold the text fields, if there were any
   */
  if (path) {
    /**
     * The filename, from FormData, takes precedent over any filename in path,
     *
     * Examples:
     *
     * POST /bucket/foo/bar.jpg form-data: (file: actual.jpg) will
     * ignore `bar.jpg` and use `actual.jpg` for the filename
     * effectively acting as POST /bucket/foo form-data: (file: actual.jpg)
     *
     * POST /bucket form-data: (file: actual.jpg, path: foo/bar.jpg) will
     * ignore `bar.jpg` and use `actual.jpg` for the filename
     * effectively acting as POST /bucket/foo form-data: (file: actual.jpg)
     */
    if (isFile(path)) path = path.split('/').slice(0, -1).join('/')
    if (path.endsWith('/')) path = path.slice(0, -1)
    object = `${path}/${object}`
  }

  const reader = await Deno.open(file.path, { read: true })

  return fork(
    res,
    201,
    storage.putObject(
      bucket,
      object,
      readableStreamFromReader(reader),
      useSignedUrl,
    ),
  )
}

export const storage = (services: HyperServices) => (app: Server) => {
  app.get(
    '/storage',
    (_req, res) => res.send({ name: 'hyper63 Storage', version: '1.0', status: 'unstable' }),
  )

  app.put<NameParams>(
    '/storage/:name',
    bindCore(services),
    ({ params, storage }, res) => fork(res, 201, storage.makeBucket(params.name)),
  )

  app.delete<NameParams>(
    '/storage/:name',
    bindCore(services),
    ({ params, storage }, res) => fork(res, 201, storage.removeBucket(params.name)),
  )

  /**
   * Allows for specifying a path in the url that the object should be placed at
   */
  app.post<NameParams>(
    '/storage/:name/*',
    bindCore(services),
    objectBodyParser,
    (req, res) => {
      const {
        params,
        file,
        body,
        storage,
        isBinary,
        isMultipartFormData,
        useSignedUrl,
      } = req
      const bucket = params.name

      if (isMultipartFormData) {
        const path = body?.path || params[0] || undefined
        return formDataObject({ params, file, path, storage, res })
      }

      // map all falsey to undefined, then let Storage port parse and catch
      const object = params[0] || undefined

      if (useSignedUrl) {
        // The reader is always undefined when using a signed url flow
        const reader = undefined
        return fork(
          res,
          201,
          storage.putObject(bucket, object, reader, useSignedUrl),
        )
      }

      if (isBinary) {
        /**
         * Convert the Express request into a Web ReadableStream.
         *
         * This works because Express' Request is an embellished
         * http.IncomingMessage which is an embellished stream.Readble
         * which is in turn an AsyncIterator
         *
         * See https://nodejs.org/api/http.html#class-httpincomingmessage
         * which extends https://nodejs.org/api/stream.html#class-streamreadable
         * which implements https://nodejs.org/api/stream.html#readablesymbolasynciterator
         *
         * This allows us to stream the request body into the adapter
         * without having to first buffer the entire body into memory
         * or onto disk. Depending on the adapter implementation, this means
         * a file could be completely streamed through hyper without having to buffer
         * the whole file on process.
         */
        const reader = readableStreamFromIterable(
          req as unknown as AsyncIterable<Uint8Array>,
        )
        return fork(
          res,
          201,
          storage.putObject(bucket, object, reader, useSignedUrl),
        )
      }

      return res
        .status(422)
        .json({ ok: false, status: 422, msg: 'Unprocessable Entity' })
    },
  )

  /**
   * This path is required to be multipart/form-data
   * because otherwise the route has no way of determining the name of the file
   * from the request
   *
   * So if it is NOT multipart/form-data, then we will return a 422
   */
  app.post<NameParams>(
    '/storage/:name',
    bindCore(services),
    formData,
    ({ params, file, body, storage }, res) =>
      formDataObject({ params, file, path: body?.path, storage, res }),
  )

  app.get<NameParams>(
    '/storage/:name/*',
    bindCore(services),
    ({ params, query, storage }, res) => {
      /**
       * If the request is wanting a signedUrl
       * Then we know the request will be JSON containing the signedUrl
       * not an iterable
       */
      const isIterable = !isTrue(query.useSignedUrl)

      return fork(
        res,
        200,
        storage
          .getObject(params.name, params[0], isTrue(query.useSignedUrl))
          // deno-lint-ignore no-explicit-any
          .map((result: any) => {
            /**
             * A hyper error is simply returned as JSON
             */
            if (isHyperErr(result)) return result
            /**
             * The useSignedUrl flow returns JSON, so simply
             * return the result and let fork do its thing
             */
            if (isTrue(query.useSignedUrl)) return result

            /**
             * Get mime type based on the object file extension in the url
             * and default to octet-stream if no extension is found
             */
            const extension = params[0]?.split('.')[1]
            const mimeType = getMimeType(extension || 'application/octet-stream') ||
              'application/octet-stream'

            res.set({ 'Content-Type': mimeType })

            const readableStream = result
            return readableStream
          }),
        isIterable,
      )
    },
  )

  app.delete(
    '/storage/:name/*',
    bindCore(services),
    ({ params, storage }, res) => fork(res, 201, storage.removeObject(params.name, params[0])),
  )

  return app
}
