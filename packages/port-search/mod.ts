import { port, type SearchPort } from './port.ts'

/**
 * Parse the provided input to ensure it correctly implements
 * the Search Port
 *
 * @param adapter - an object to parse
 * @returns a hyper Search Port implementation
 */
export function search(adapter: unknown) {
  const instance = port.parse(adapter)

  instance.createIndex = port.shape.createIndex.implement(instance.createIndex)
  instance.deleteIndex = port.shape.deleteIndex.implement(instance.deleteIndex)
  instance.indexDoc = port.shape.indexDoc.implement(instance.indexDoc)
  instance.getDoc = port.shape.getDoc.implement(instance.getDoc)
  instance.updateDoc = port.shape.updateDoc.implement(instance.updateDoc)
  instance.removeDoc = port.shape.removeDoc.implement(instance.removeDoc)
  instance.query = port.shape.query.implement(instance.query)

  return instance
}

export type { SearchPort }
