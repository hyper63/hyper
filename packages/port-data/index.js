const z = require('zod')
/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
module.exports = function (adapter) {
  const Port = z.object({ 
    createDatabase: z.function().args(z.string()).returns(z.promise(z.object({ok: z.boolean()}))),
    removeDatabase: z.function().args(z.string()).returns(z.promise(z.object({ ok: z.boolean()}))),
    createDocument: z.function().args(z.object({
      db: z.string(),
      id: z.string(),
      doc: z.object()
    })).returns(z.promise(z.object({
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
      })).returns(z.promise(z.object({
        ok: z.boolean(),
        id: z.string()
      }))),
    removeDocument: z.function()
      .args(z.object({
        db: z.string(),
        id: z.string()
      })).returns(z.promise(z.object({
        ok: z.boolean(),
        id: z.string()
      }))),
    // TODO: listDocuments
    // TODO: queryDocuments
    // TODO: createIndex 
 })
 const instance = Port.parse(adapter)
 instance.createDatabase = Port.shape.createDatabase.validate(instance.createDatabase)
 instance.removeDatabase = Port.shape.removeDatabase.validate(instance.removeDatabase)
 instance.createDocument = Port.shape.createDocument.validate(instance.createDocument)
 instance.retrieveDocument = Port.shape.retrieveDocument.validate(instance.retrieveDocument)
 instance.updateDocument = Port.shape.updateDocument.validate(instance.updateDocument)
 instance.removeDocument = Port.shape.removeDocument.validate(instance.removeDocument)
  

 return instance
}