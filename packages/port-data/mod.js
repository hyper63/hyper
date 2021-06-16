import { z } from './deps.js'

/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
export function data (adapter) {
  const Port = z.object({
    createDatabase: z.function().args(z.string()).returns(
      z.promise(z.object({ ok: z.boolean() }))
    ),
    removeDatabase: z.function().args(z.string()).returns(
      z.promise(z.object({ ok: z.boolean() }))
    ),
    createDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string(),
        doc: z.any()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        id: z.string()
      }))),
    retrieveDocument: z.function().args(z.object({
      db: z.string(),
      id: z.string()
    })).returns(z.promise(z.any())),
    updateDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string(),
        doc: z.object()
      })).returns(z.promise(z.any())),
    removeDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string()
      })).returns(z.promise(z.object({
        ok: z.boolean(),
        id: z.string()
      }))),
    listDocuments: z.function()
      .args(z.object({
        db: z.string(),
        limit: z.string().optional(),
        startkey: z.string().optional(),
        endkey: z.string().optional(),
        keys: z.string().optional(),
        descending: z.boolean().optional()
      })).returns(z.promise(z.object({
        ok: z.boolean(),
        docs: z.array(z.any())
      }))),
    queryDocuments: z.function()
      .args(z.object({
        db: z.string(),
        query: z.object({
          selector: z.any(),
          sort: z.array(z.string()).optional(),
          limit: z.number().optional(),
          use_index: z.string().optional()
        })
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        docs: z.array(z.any())
      }))),
    indexDocuments: z.function()
      .args(z.object({
        db: z.string(),
        name: z.string(),
        fields: z.array(z.string())
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional()
      }))),
    bulkDocuments: z.function()
      .args(z.object({
        db: z.string(),
        docs: z.array(z.any())
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        results: z.array(z.object({
          ok: z.boolean(),
          id: z.string()
        }))
      })))
  })
  const instance = Port.parse(adapter)
  instance.createDatabase = Port.shape.createDatabase.validate(
    instance.createDatabase
  )
  instance.removeDatabase = Port.shape.removeDatabase.validate(
    instance.removeDatabase
  )
  instance.createDocument = Port.shape.createDocument.validate(
    instance.createDocument
  )
  instance.retrieveDocument = Port.shape.retrieveDocument.validate(
    instance.retrieveDocument
  )
  // instance.updateDocument = Port.shape.updateDocument.validate(instance.updateDocument)
  instance.updateDocument = adapter.updateDocument
  instance.removeDocument = Port.shape.removeDocument.validate(
    instance.removeDocument
  )
  instance.listDocuments = Port.shape.listDocuments.validate(
    instance.listDocuments
  )
  instance.queryDocuments = Port.shape.queryDocuments.validate(
    instance.queryDocuments
  )
  instance.indexDocuments = Port.shape.indexDocuments.validate(
    instance.indexDocuments
  )
  instance.bulkDocuments = Port.shape.bulkDocuments.validate(
    instance.bulkDocuments
  )

  return instance
}
