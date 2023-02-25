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
       * id vs key vs 'nothing'. Let adapter impls experiment
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

export const port = z.object({
  // list cache stores
  index: z
    .function()
    .args()
    .returns(
      // TODO: only allow hyper response format.
      z.promise(
        z.union([
          z.string().array(),
          hyperResponse({ caches: z.string().array() }),
        ]),
      ),
    ),
  createStore: z
    .function()
    .args(z.string())
    .returns(z.promise(hyperResponse({}))),
  destroyStore: z
    .function()
    .args(z.string())
    .returns(z.promise(hyperResponse({}))),
  createDoc: z
    .function()
    .args(
      z.object({
        store: z.string(),
        key: z.string(),
        value: z.record(z.any()),
        ttl: z.string().optional(),
      }),
    )
    .returns(z.promise(hyperResponse({}))),
  getDoc: z
    .function()
    .args(z.object({ store: z.string(), key: z.string() }))
    .returns(
      z.promise(
        // TODO: only allow hyper response format.
        z.union([
          z.object({}).passthrough(),
          hyperResponse({
            doc: z.record(z.any()),
          }),
        ]),
      ),
    ),
  updateDoc: z
    .function()
    .args(
      z.object({
        store: z.string(),
        key: z.string(),
        value: z.record(z.any()),
        ttl: z.string().optional(),
      }),
    )
    .returns(z.promise(hyperResponse({}))),
  deleteDoc: z
    .function()
    .args(
      z.object({
        store: z.string(),
        key: z.string(),
      }),
    )
    .returns(z.promise(hyperResponse({}))),
  listDocs: z
    .function()
    .args(z.object({ store: z.string(), pattern: z.string().optional() }))
    .returns(z.promise(hyperResponse({ docs: z.array(z.record(z.any())) }))),
})

export type CachePort = z.infer<typeof port>
