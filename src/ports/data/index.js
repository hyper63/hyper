import * as z from 'zod'

/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
export default function (adapter) {
  const Port = z.object({ 
    createDatabase: z.function(),
    removeDatabase: z.function(),
    createDocument: z.function(),
    retrieveDocument: z.function(),
    updateDocument: z.function(),
    removeDocument: z.function(),
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