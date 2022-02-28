import { z } from "./deps.js";

/**
 * The hyper response schema. MOST adapter methods return this shape.
 * The ones that do not will be refactored to do so in upcoming major releases
 *
 * basically, there are two distinct types, each identifiable
 * by the ok field. This is precisely the use case for Zod's discriminated Union
 * Otherwise, all fields would be optional which isn't much of a schema
 *
 * See https://github.com/colinhacks/zod#discriminated-unions
 * NOTE: using discriminated union is blocked by https://github.com/colinhacks/zod/issues/965
 * for now, just using a regular union :(
 * TODO: use discriminated when issue above is fixed
 *
 * @argument {z.ZodSchema} - the schema for the success response, it is extended to ensure
 * ok: true is always parsed
 */
const hyperResSchema = (schema = z.object({ ok: z.boolean() })) =>
  z.union([
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

const QueueListResponse = z.union([
  // TODO: this needs to follow the hyper response format
  z.string().array(),
  hyperResSchema(z.object({
    queues: z.string().array(),
  })),
]);

const QueueCreateInput = z.object({
  name: z.string(),
  target: z.string().url(),
  secret: z.string().max(100).optional(),
});

const QueueResponse = hyperResSchema();

const QueuePostInput = z.object({
  name: z.string(),
  job: z.object({}).passthrough(),
});

const QueueGetInput = z.object({
  name: z.string(),
  status: z.enum(["READY", "ERROR"]),
});

const JobsResponse = hyperResSchema(z.object({
  jobs: z.array(z.object({}).passthrough()).optional(),
}));

const JobInput = z.object({
  name: z.string(),
  id: z.string(),
});

const QueuePort = z.object({
  index: z.function()
    .args()
    .returns(z.promise(QueueListResponse)),
  create: z.function()
    .args(QueueCreateInput)
    .returns(z.promise(hyperResSchema())),
  delete: z.function()
    .args(z.string())
    .returns(z.promise(QueueResponse)),
  post: z.function()
    .args(QueuePostInput)
    .returns(z.promise(QueueResponse)),
  get: z.function()
    .args(QueueGetInput)
    .returns(z.promise(JobsResponse)),
  retry: z.function()
    .args(JobInput)
    .returns(z.promise(QueueResponse)),
  cancel: z.function()
    .args(JobInput)
    .returns(z.promise(QueueResponse)),
});

export function queue(adapter) {
  const instance = QueuePort.parse(adapter);

  // wrap the functions with validators
  instance.index = QueuePort.shape.index.validate(instance.index);
  instance.create = QueuePort.shape.create.validate(instance.create);
  instance.post = QueuePort.shape.post.validate(instance.post);
  instance.delete = QueuePort.shape.delete.validate(instance.delete);
  instance.get = QueuePort.shape.get.validate(instance.get);
  instance.retry = QueuePort.shape.retry.validate(instance.retry);
  instance.cancel = QueuePort.shape.cancel.validate(instance.cancel);

  return instance;
}
