import type { CachePort } from '../../deps.ts'
import type { EventsManager } from '../../types.ts'

import * as store from './store.ts'
import * as doc from './doc.ts'

export default function ({
  cache,
  events,
}: {
  cache: CachePort
  events: EventsManager
}) {
  const index = () => store.index().runWith({ svc: cache, events })

  /**
   * @param {string} name
   */
  const createStore = (name: string) => store.create(name).runWith({ svc: cache, events })

  /**
   * @param {string} name
   */
  const deleteStore = (name: string) => store.del(name).runWith({ svc: cache, events })

  /**
   * @param {string} store
   * @param {string} key
   * @param {object} value
   * @param {string} [ttl] - short hand for time to live 30m, 1hr, 1d
   */
  const createDoc = (
    store: string,
    key: string,
    value: Record<string, unknown>,
    ttl?: string,
  ) => doc.create(store, key, value, ttl).runWith({ svc: cache, events })

  /**
   * @param {string} store
   * @param {string} key
   * @param {object} value
   */
  const updateDoc = (
    store: string,
    key: string,
    value: Record<string, unknown>,
    ttl?: string,
  ) => doc.update(store, key, value, ttl).runWith({ svc: cache, events })

  /**
   * @param {string} store
   * @param {string} key
   * @param {boolean?} isLegacyGetEnabled
   *
   * TODO: LEGACY_GET: default to false on next major version. Then remove on next major version
   */
  const getDoc = (store: string, key: string, isLegacyGetEnabled = true) =>
    doc.get(store, key).runWith({ svc: cache, events, isLegacyGetEnabled })

  /**
   * @param {string} store
   * @param {string} key
   */
  const deleteDoc = (store: string, key: string) =>
    doc.del(store, key).runWith({ svc: cache, events })

  /**
   * @param {string} name
   * @param {string} pattern
   */
  const queryStore = (name: string, pattern: string) =>
    store.query(name, pattern).runWith({ svc: cache, events })

  return Object.freeze({
    index,
    createStore,
    deleteStore,
    createDoc,
    updateDoc,
    getDoc,
    deleteDoc,
    queryStore,
  })
}
