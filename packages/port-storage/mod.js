import { z } from "./deps.js";

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
      .args(z.void())
      .returns(z.promise(z.object({
        ok: z.boolean(),
        buckets: z.array(z.string()),
      }))),
    putObject: z.function()
      .args(z.object({
        bucket: z.string(),
        object: z.string(),
        stream: z.any(),
      }))
      .returns(z.promise(z.object({ ok: z.boolean() }))),
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
  instance.putObject = Port.shape.putObject.validate(instance.putObject);
  instance.removeObject = Port.shape.removeObject.validate(
    instance.removeObject,
  );
  instance.listObjects = Port.shape.listObjects.validate(instance.listObjects);

  return instance;
}
