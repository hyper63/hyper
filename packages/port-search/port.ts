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

const doc = z.record(z.any())
const idShape = { id: z.string() }

export const port = z.object({
  createIndex: z
    .function()
    .args(
      z.object({
        index: z.string(),
        mappings: z.object({
          fields: z.array(z.string()),
          storeFields: z.array(z.string()).optional(),
        }),
      }),
    )
    .returns(z.promise(hyperResponse({}))),
  deleteIndex: z
    .function()
    .args(z.string())
    .returns(z.promise(hyperResponse({}))),
  indexDoc: z
    .function()
    // remember to invalidate if key === query
    .args(z.object({ index: z.string(), key: z.string(), doc }))
    .returns(z.promise(hyperResponse({}))),
  updateDoc: z
    .function()
    .args(z.object({ index: z.string(), key: z.string(), doc }))
    .returns(z.promise(hyperResponse({}))),
  getDoc: z
    .function()
    .args(z.object({ index: z.string(), key: z.string() }))
    .returns(z.promise(hyperResponse({ key: z.string(), doc }))),
  removeDoc: z
    .function()
    .args(z.object({ index: z.string(), key: z.string() }))
    .returns(z.promise(hyperResponse({}))),
  bulk: z
    .function()
    .args(z.object({ index: z.string(), docs: z.array(doc) }))
    .returns(
      /**
       * id is required here since a bulk index operation requires
       * that each document have an id or _id value
       *
       * TODO: should bulk require 'key' instead of _id or id on documents,
       * to be consistent with other apis on the search port?
       * For now, keeping as is.
       */
      z.promise(hyperResponse({ results: z.array(hyperResponse(idShape)) })),
    ),
  query: z
    .function()
    .args(
      z.object({
        index: z.string(),
        q: z.object({
          query: z.string(),
          fields: z.array(z.string()).optional(),
          filter: z.record(z.any()).optional(),
        }),
      }),
    )
    .returns(z.promise(hyperResponse({ matches: z.array(doc) }))),
})

export type SearchPort = z.infer<typeof port>
