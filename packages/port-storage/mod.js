import { z } from "./deps.js";

const putObjectUploadSchemaArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  stream: z.object({}).passthrough(),
  // omitting is falsey, so make it optional, but MUST be false if defined
  useSignedUrl: z.literal(false).optional(),
});
const putObjectUploadSchema = z.function()
  .args(putObjectUploadSchemaArgs)
  .returns(z.promise(z.object({ ok: z.boolean(), url: z.void() })));

const putObjectSignedUrlSchemaArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  // MUST NOT be provided alongside useSignedUrl
  stream: z.void(),
  useSignedUrl: z.literal(true),
});
const putObjectSignedUrlSchema = z.function()
  .args(putObjectSignedUrlSchemaArgs)
  .returns(z.promise(z.object({ ok: z.boolean(), url: z.string().url() })));

/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
export function storage(adapter) {
  const Port = z.object({
    makeBucket: z.function()
      .args(z.string())
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional(),
      }))),
    removeBucket: z.function()
      .args(z.string())
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional(),
      }))),
    listBuckets: z.function()
      .args()
      .returns(z.promise(z.object({
        ok: z.boolean(),
        buckets: z.array(z.string()),
      }))),
    putObject: z.function()
      .args(z.union([
        putObjectUploadSchemaArgs,
        putObjectSignedUrlSchemaArgs,
      ]))
      // validation of return is handled by subschemas
      .returns(z.promise(z.any())),
    removeObject: z.function()
      .args(z.object({
        bucket: z.string(),
        object: z.string(),
      }))
      .returns(z.promise(z.object({ ok: z.boolean() }))),
    getObject: z.function()
      .args(z.object({
        bucket: z.string(),
        object: z.string(),
      }))
      .returns(z.promise(z.any())),
    listObjects: z.function()
      .args(z.object({
        bucket: z.string(),
        prefix: z.string().optional(),
      }))
      .returns(z.promise(z.any())),
  });

  const instance = Port.parse(adapter);

  instance.makeBucket = Port.shape.makeBucket.validate(instance.makeBucket);
  instance.removeBucket = Port.shape.removeBucket.validate(
    instance.removeBucket,
  );
  instance.listBuckets = Port.shape.listBuckets.validate(instance.listBuckets);

  const original = instance.putObject;
  instance.putObject = Port.shape.putObject.implement((params) => {
    /**
     * params are already validated against union type
     * so now determine which function type to use for full
     * end-to-end validation
     */
    if (!params.useSignedUrl) {
      // upload request
      return putObjectUploadSchema.validate(original)(params);
    }

    // signed url request
    return putObjectSignedUrlSchema.validate(original)(params);
  });

  instance.removeObject = Port.shape.removeObject.validate(
    instance.removeObject,
  );
  instance.listObjects = Port.shape.listObjects.validate(instance.listObjects);

  return instance;
}
