import { z } from "./deps.js";

/**
 * The hyper response schema. MOST adapter methods return this shape.
 * The ones that do not will be refactored to do so in upcoming major releases
 *
 * basically, there are two distinct types, each identifiable
 * by the ok field. This is precisely the use case for Zod's discriminated Union
 * Otherwise, all fields would be optional which isn't much of a schema
 *
 * @argument {z.ZodSchema} - the schema for the success response, it is extended to ensure
 * ok: true is always parsed
 */
const hyperResSchema = (schema = z.object({ ok: z.boolean() })) =>
  z.discriminatedUnion("ok", [
    // ok: true
    schema.extend({
      ok: z.literal(true),
      // TODO: These two fields ought not come back for ok: true responses
      // but are kept for backwards compatibility.
      msg: z.string().optional(),
      status: z.number().optional(),
    }),
    // ok: false aka. HyperErr
    z.object({
      ok: z.literal(false),
      msg: z.string().optional(),
      status: z.number().optional(),
    }),
  ]);

const putObjectUploadSchemaArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  stream: z.any().refine(
    (val) => val != null, // intentionally not "double equals" to catch undefined and null
    { message: "stream must be defined" },
  ),
  // omitting is falsey, so make it optional, but MUST be false if defined
  useSignedUrl: z.literal(false).optional(),
});
const putObjectUploadSchema = z.function()
  .args(putObjectUploadSchemaArgs)
  .returns(
    z.promise(
      hyperResSchema(z.object({
        url: z.void(),
      })),
    ),
  );

const putObjectSignedUrlSchemaArgs = z.object({
  bucket: z.string(),
  object: z.string(),
  // MUST NOT be provided alongside useSignedUrl
  stream: z.void(),
  useSignedUrl: z.literal(true),
});
const putObjectSignedUrlSchema = z.function()
  .args(putObjectSignedUrlSchemaArgs)
  .returns(
    z.promise(
      hyperResSchema(z.object({
        url: z.string().url(),
      })),
    ),
  );

/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
export function storage(adapter) {
  const Port = z.object({
    makeBucket: z.function()
      .args(z.string())
      .returns(z.promise(hyperResSchema())),
    removeBucket: z.function()
      .args(z.string())
      .returns(z.promise(hyperResSchema())),
    listBuckets: z.function()
      .args()
      .returns(z.promise(
        hyperResSchema(z.object({
          buckets: z.array(z.string()),
        })),
      )),
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
      .returns(z.promise(hyperResSchema())),
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
      .returns(z.promise(
        z.union([
          z.any(),
          hyperResSchema(z.object({
            objects: z.any(),
          })),
        ]),
      )),
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
