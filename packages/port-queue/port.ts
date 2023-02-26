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
    z
      .object({
        ...schema,
        ok: z.literal(true),
        msg: z.string().optional(),
        status: z.number().optional(),
      })
      /**
       * Allow other keys to passthrough until we
       * decide on which additional fields to return across apis ie.
       * id vs 'nothing'. Let adapter impls experiment
       * and see what feels right
       */
      .passthrough(),
    // ok: false aka. HyperErr
    z.object({
      ok: z.literal(false),
      msg: z.string().optional(),
      status: z.number().optional(),
    }),
  ])

const QueueResponse = hyperResponse({})

const JobsResponse = hyperResponse({
  jobs: z.array(z.record(z.any())).optional(),
})

const JobInput = z.object({
  name: z.string(),
  id: z.string(),
})

export const port = z.object({
  index: z
    .function()
    .args()
    .returns(
      z.promise(
        z.union([
          // TODO: only allow hyper response format.
          z.string().array(),
          hyperResponse({ queues: z.string().array() }),
        ]),
      ),
    ),
  create: z
    .function()
    .args(
      z.object({
        name: z.string(),
        target: z.string().url(),
        secret: z.string().max(100).optional(),
      }),
    )
    .returns(z.promise(QueueResponse)),
  delete: z.function().args(z.string()).returns(z.promise(QueueResponse)),
  post: z
    .function()
    .args(z.object({ name: z.string(), job: z.record(z.any()) }))
    .returns(z.promise(QueueResponse)),
  get: z
    .function()
    .args(z.object({ name: z.string(), status: z.enum(['READY', 'ERROR']) }))
    .returns(z.promise(JobsResponse)),
  retry: z.function().args(JobInput).returns(z.promise(QueueResponse)),
  cancel: z.function().args(JobInput).returns(z.promise(QueueResponse)),
})

export type QueuePort = z.infer<typeof port>
