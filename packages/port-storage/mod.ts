import {
  getObjectDownloadSchema,
  getObjectSignedUrlSchema,
  port,
  putObjectSignedUrlSchema,
  putObjectUploadSchema,
  type StoragePort,
} from './port.ts'

export type { StoragePort }

/**
 * Parse the provided input to ensure it correctly implements
 * the Storage Port
 *
 * @param adapter - an object to parse
 * @returns a hyper Storage Port implementation
 */
export function storage(adapter: unknown) {
  const instance = port.parse(adapter)

  instance.makeBucket = port.shape.makeBucket.implement(instance.makeBucket)
  instance.removeBucket = port.shape.removeBucket.implement(
    instance.removeBucket,
  )
  instance.listBuckets = port.shape.listBuckets.implement(instance.listBuckets)

  const originalPutObject = instance.putObject
  instance.putObject = port.shape.putObject.implement((params) => {
    /**
     * params are already validated against union type
     * so now determine which function type to use for full
     * end-to-end validation
     */
    // upload request
    if (!params.useSignedUrl) {
      return putObjectUploadSchema.implement(originalPutObject)(params)
    }
    // presigned put url
    return putObjectSignedUrlSchema.implement(originalPutObject)(params)
  })

  const originalGetObject = instance.getObject
  instance.getObject = port.shape.getObject.implement((params) => {
    /**
     * params are already validated against union type
     * so now determine which function type to use for full
     * end-to-end validation
     */
    // download request
    if (!params.useSignedUrl) {
      return getObjectDownloadSchema.implement(originalGetObject)(params)
    }
    // presigned get url
    return getObjectSignedUrlSchema.implement(originalGetObject)(params)
  })
  instance.removeObject = port.shape.removeObject.implement(
    instance.removeObject,
  )
  instance.listObjects = port.shape.listObjects.implement(instance.listObjects)

  return instance
}
