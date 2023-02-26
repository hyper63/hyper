import { type DataPort, port } from './port.ts'

export type { DataPort }

/**
 * Parse the provided input to ensure it correctly implements
 * the Data Port
 *
 * @param adapter - an object to parse
 * @returns a hyper Data Port implementation
 */
export function data(adapter: unknown) {
  const instance = port.parse(adapter)
  instance.createDatabase = port.shape.createDatabase.implement(
    instance.createDatabase,
  )
  instance.removeDatabase = port.shape.removeDatabase.implement(
    instance.removeDatabase,
  )
  instance.createDocument = port.shape.createDocument.implement(
    instance.createDocument,
  )
  instance.retrieveDocument = port.shape.retrieveDocument.implement(
    instance.retrieveDocument,
  )
  instance.updateDocument = port.shape.updateDocument.implement(
    instance.updateDocument,
  )
  instance.removeDocument = port.shape.removeDocument.implement(
    instance.removeDocument,
  )
  instance.listDocuments = port.shape.listDocuments.implement(
    instance.listDocuments,
  )
  instance.queryDocuments = port.shape.queryDocuments.implement(
    instance.queryDocuments,
  )
  instance.indexDocuments = port.shape.indexDocuments.implement(
    instance.indexDocuments,
  )
  instance.bulkDocuments = port.shape.bulkDocuments.implement(
    instance.bulkDocuments,
  )

  return instance
}
