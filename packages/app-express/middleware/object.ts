import { multer } from '../deps.ts'
import type { RouteHandler, UploadedFile } from '../types.ts'
import { isMultipartFormData, isTrue } from '../utils.ts'

/**
 * Used when handling multipart/form-data uploads
 */
export const formData = multer({ dest: '/tmp/hyper/uploads' }).single('file')

/**
 * When uploading an object, the object could be provided as:
 * - multipart/form-data
 * - raw binary data
 * - Not provided at all, in which case a signed url is being requested
 *
 * This middleware is responsible for determining the intent of the Request
 * and running it throught the appropriate middleware
 */
export const objectBodyParser: RouteHandler = (req, res, next) => {
  const contentType = req.get('Content-Type')
  const accept = req.get('Accept')

  /**
   * The body is multipart/form-data
   * so parse it as such
   *
   * req.body will contain text fields ie. 'path'
   * if provided
   */
  if (isMultipartFormData(contentType)) {
    req.isMultipartFormData = true
    return formData(req, res, next)
  }

  /**
   * Client is expecting JSON containing a signed url to be returned,
   * either indicated by:
   * 1. Accept header being set to application/json
   * 2. OR useSignedUrl query parameter
   * 3. OR No Content-Type header being included in the request
   */
  if (
    accept === 'application/json' ||
    isTrue(req.query?.useSignedUrl) ||
    !contentType
  ) {
    req.useSignedUrl = true
    return next()
  }

  /**
   * Do I need to use raw here?
   *
   * If this is turned into a Deno Request Body,
   * then I should be able to pass the body through
   * ie. proxy
   *
   * https://medium.com/deno-the-complete-reference/handle-file-uploads-in-deno-ee14bd2b16d9#Pass-through-uploaded-file
   */
  req.isBinary = true
  return next()
}

declare global {
  namespace Express {
    export interface Request {
      useSignedUrl?: boolean
      isBinary?: boolean
      isMultipartFormData?: boolean
      file?: UploadedFile
    }
  }
}
