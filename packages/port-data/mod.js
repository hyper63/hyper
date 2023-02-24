import { z } from './deps.js'

const SortEnum = z.enum(['ASC', 'DESC'])

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
  z.discriminatedUnion('ok', [
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
  ])

/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
export function data(adapter) {
  const Port = z.object({
    createDatabase: z.function().args(z.string()).returns(
      z.promise(
        hyperResSchema(),
      ),
    ),
    removeDatabase: z.function().args(z.string()).returns(
      z.promise(
        hyperResSchema(),
      ),
    ),
    createDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string(),
        doc: z.any(),
      }))
      .returns(z.promise(
        hyperResSchema(
          z.object({
            id: z.string(),
          }),
        ),
      )),
    retrieveDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string(),
        // TODO: this needs to follow the hyper response format.
      })).returns(z.promise(z.any())),
    updateDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string(),
        doc: z.object(),
        // TODO: this needs to follow the hyper response format.
      })).returns(z.promise(z.any())),
    removeDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string(),
      })).returns(z.promise(
        hyperResSchema(
          z.object({
            id: z.string(),
          }),
        ),
      )),
    listDocuments: z.function()
      .args(z.object({
        db: z.string(),
        limit: z.string().optional(),
        startkey: z.string().optional(),
        endkey: z.string().optional(),
        keys: z.string().optional(),
        descending: z.boolean().optional(),
      })).returns(z.promise(
        hyperResSchema(
          z.object({
            docs: z.array(z.any()),
          }),
        ),
      )),
    queryDocuments: z.function()
      .args(z.object({
        db: z.string(),
        query: z.object({
          selector: z.any(),
          fields: z.array(z.string()).optional(),
          sort: z.array(
            z.union([SortEnum, z.record(SortEnum)]),
          ).optional(),
          limit: z.number().optional(),
          use_index: z.string().optional(),
        }),
      }))
      .returns(z.promise(
        hyperResSchema(
          z.object({
            docs: z.array(z.any()),
          }),
        ),
      )),
    indexDocuments: z.function()
      .args(z.object({
        db: z.string(),
        name: z.string(),
        fields: z.array(z.string()),
      }))
      .returns(z.promise(hyperResSchema())),
    bulkDocuments: z.function()
      .args(z.object({
        db: z.string(),
        docs: z.array(z.any()),
      }))
      .returns(z.promise(
        hyperResSchema(
          z.object({
            results: z.array(z.object({
              ok: z.boolean(),
              id: z.string(),
            })),
          }),
        ),
      )),
  })
  const instance = Port.parse(adapter)
  instance.createDatabase = Port.shape.createDatabase.validate(
    instance.createDatabase,
  )
  instance.removeDatabase = Port.shape.removeDatabase.validate(
    instance.removeDatabase,
  )
  instance.createDocument = Port.shape.createDocument.validate(
    instance.createDocument,
  )
  instance.retrieveDocument = Port.shape.retrieveDocument.validate(
    instance.retrieveDocument,
  )
  // instance.updateDocument = Port.shape.updateDocument.validate(instance.updateDocument)
  instance.updateDocument = adapter.updateDocument
  instance.removeDocument = Port.shape.removeDocument.validate(
    instance.removeDocument,
  )
  instance.listDocuments = Port.shape.listDocuments.validate(
    instance.listDocuments,
  )
  instance.queryDocuments = Port.shape.queryDocuments.validate(
    instance.queryDocuments,
  )
  instance.indexDocuments = Port.shape.indexDocuments.validate(
    instance.indexDocuments,
  )
  instance.bulkDocuments = Port.shape.bulkDocuments.validate(
    instance.bulkDocuments,
  )

  return instance
}
