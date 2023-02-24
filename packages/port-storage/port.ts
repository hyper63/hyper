import { z, ZodRawShape } from './deps.ts'

/**
 * The hyper response schema. MOST adapter methods return this shape.
 * The ones that do not will be refactored to do so in upcoming major releases
 *
 * There are two distinct types, a "success" and "error" type, each identifiable
 * by the ok field, false and true, respectively.
 *
 * This distinction off a discriminating field is precisely the use case for Zod's Discriminated Union.
 * Otherwise, all fields would be optional, which isn't much of a schema.
 *
 * @argument {z.ZodSchema} schema - the schema for the success response, it is extended to ensure
 * ok: true is always parsed
 */
const hyperResponse = <T extends ZodRawShape>(schema: T) =>
  z.discriminatedUnion('ok', [
    // ok: true
    z.object({
      ...schema,
      ok: z.literal(true),
      msg: z.string().optional(),
      status: z.number().optional(),
    }),
    // ok: false aka. HyperErr
    z.object({
      ok: z.literal(false),
      msg: z.string().optional(),
      status: z.number().optional(),
    }),
  ])

const putObjectUploadArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  stream: z.any().refine(
    /**
     * intentionally not "double equals" to also coerce undefined to null
     */
    (val) => val != null,
    { message: 'stream must be defined' },
  ),
  /**
   * If a value is defined, then it MUST be false,
   * otherwise it is optional
   */
  useSignedUrl: z.literal(false).optional(),
})
/**
 * The schema that describes the putObject arguments,
 * when requesting a pre-signed url
 */
export const putObjectUploadSchema = z
  .function()
  .args(putObjectUploadArgs)
  .returns(z.promise(hyperResponse({ url: z.void() })))

const putObjectSignedUrlArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  // MUST NOT be provided alongside useSignedUrl
  stream: z.void(),
  useSignedUrl: z.literal(true),
})
export const putObjectSignedUrlSchema = z
  .function()
  .args(putObjectSignedUrlArgs)
  .returns(z.promise(hyperResponse({ url: z.string().url() })))

const getObjectSignedUrlArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  useSignedUrl: z.literal(true),
})
/**
 * The schema that describes the getObject arguments,
 * when requesting a pre-signed url
 */
export const getObjectSignedUrlSchema = z
  .function()
  .args(getObjectSignedUrlArgs)
  .returns(z.promise(hyperResponse({ url: z.string().url() })))

const getObjectDownloadArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  useSignedUrl: z.literal(false).optional(),
})
/**
 * The schema that describes the getObject arguments,
 * when downloading an object, directly
 */
export const getObjectDownloadSchema = z
  .function()
  .args(getObjectDownloadArgs)
  .returns(z.promise(z.any()))

export const port = z.object({
  makeBucket: z
    .function()
    .args(z.string())
    .returns(z.promise(hyperResponse({}))),
  removeBucket: z
    .function()
    .args(z.string())
    .returns(z.promise(hyperResponse({}))),
  listBuckets: z
    .function()
    .args()
    .returns(z.promise(hyperResponse({ buckets: z.array(z.string()) }))),
  putObject: z
    .function()
    .args(z.union([putObjectSignedUrlArgs, putObjectUploadArgs]))
    // Output parsing determined by input type (see mod.ts)
    .returns(z.promise(z.any())),
  removeObject: z
    .function()
    .args(z.object({ bucket: z.string(), object: z.string() }))
    .returns(z.promise(hyperResponse({}))),
  getObject: z
    .function()
    .args(z.union([getObjectSignedUrlArgs, getObjectDownloadArgs]))
    // Output parsing determined by input type (see mod.ts)
    .returns(z.promise(z.any())),
  listObjects: z
    .function()
    .args(z.object({ bucket: z.string(), prefix: z.string().optional() }))
    .returns(
      z.promise(
        hyperResponse({
          objects: z.array(
            z.any().refine(
              /**
               * intentionally not "double equals" to also coerce undefined to null
               */
              (val) => val != null,
              { message: 'stream must be defined' },
            ),
          ),
        }),
      ),
    ),
})

export type StoragePort = z.infer<typeof port>
