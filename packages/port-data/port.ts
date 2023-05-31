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

const SortEnum = z.enum(['ASC', 'DESC'])

const doc = z.record(z.any())

const maybeNumber = z.preprocess((val) => {
  if (typeof val === 'number') return val
  /**
   * Let zod do its job and reject the value
   */
  if (typeof val !== 'string') return val

  const parsed = parseFloat(val)
  /**
   * The string could not be parsed into a number
   * so let zod do its job and reject the value
   */
  if (isNaN(parsed)) return val
  return parsed
}, z.number())

export const port = z.object({
  createDatabase: z
    .function()
    .args(z.string())
    .returns(z.promise(hyperResponse({}))),
  removeDatabase: z
    .function()
    .args(z.string())
    .returns(z.promise(hyperResponse({}))),
  createDocument: z
    .function()
    .args(z.object({ db: z.string(), id: z.string(), doc }))
    .returns(z.promise(hyperResponse({ id: z.string() }))),
  retrieveDocument: z
    .function()
    .args(z.object({ db: z.string(), id: z.string() }))
    // TODO: only allow hyper response format.
    .returns(z.promise(z.union([z.record(z.any()), hyperResponse({ doc })]))),
  updateDocument: z
    .function()
    .args(z.object({ db: z.string(), id: z.string(), doc }))
    .returns(z.promise(hyperResponse({ id: z.string() }))),
  removeDocument: z
    .function()
    .args(z.object({ db: z.string(), id: z.string() }))
    .returns(z.promise(hyperResponse({ id: z.string() }))),
  listDocuments: z
    .function()
    .args(
      z.object({
        db: z.string(),
        limit: maybeNumber.optional(),
        startkey: z.string().optional(),
        endkey: z.string().optional(),
        // TODO: should we just make this an array?
        keys: z.string().optional(),
        descending: z.boolean().optional(),
      }),
    )
    .returns(z.promise(hyperResponse({ docs: z.array(doc) }))),
  queryDocuments: z
    .function()
    .args(
      z.object({
        db: z.string(),
        query: z.object({
          // TODO: enforce selector api
          selector: z.record(z.any()).optional(),
          fields: z.array(z.string()).optional(),
          sort: z
            .union([z.array(z.string()), z.array(z.record(SortEnum))])
            .optional(),
          limit: maybeNumber.optional(),
          use_index: z.string().optional(),
        }),
      }),
    )
    .returns(z.promise(hyperResponse({ docs: z.array(doc) }))),
  indexDocuments: z
    .function()
    .args(
      z.object({
        db: z.string(),
        name: z.string(),
        fields: z.union([z.array(z.string()), z.array(z.record(SortEnum))]),
      }),
    )
    .returns(z.promise(hyperResponse({}))),
  bulkDocuments: z
    .function()
    .args(z.object({ db: z.string(), docs: z.array(z.record(z.any())) }))
    .returns(
      z.promise(
        hyperResponse({
          results: z.array(hyperResponse({ id: z.string() })),
        }),
      ),
    ),
})

export type DataPort = z.infer<typeof port>
