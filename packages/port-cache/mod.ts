import { type CachePort, port as cachePort } from './port.ts'

export type { CachePort }

/**
 * Parse the provided input to ensure it correctly implements
 * the Cache Port
 *
 * @param adapter - an object to parse
 * @returns a hyper Cache Port implementation
 */
export function cache(adapter: unknown) {
  const instance = cachePort.parse(adapter)

  instance.createStore = cachePort.shape.createStore.implement(
    instance.createStore,
  )
  instance.destroyStore = cachePort.shape.destroyStore.implement(
    instance.destroyStore,
  )
  instance.createDoc = cachePort.shape.createDoc.implement(instance.createDoc)
  instance.getDoc = cachePort.shape.getDoc.implement(instance.getDoc)
  instance.updateDoc = cachePort.shape.updateDoc.implement(instance.updateDoc)
  instance.deleteDoc = cachePort.shape.deleteDoc.implement(instance.deleteDoc)
  instance.listDocs = cachePort.shape.listDocs.implement(instance.listDocs)

  return instance
}
