import type { SearchPort } from '../../deps.ts'
import type { EventsManager } from '../../types.ts'

import * as index from './index.ts'
import * as document from './doc.ts'

export default function ({
  search,
  events,
}: {
  search: SearchPort
  events: EventsManager
}) {
  /**
   * @param indexname
   * @param mappings
   */
  const createIndex = (
    indexname: string,
    mappings: Parameters<SearchPort['createIndex']>[0]['mappings'],
  ) => index.createIndex(indexname, mappings).runWith({ svc: search, events })

  /**
   * @param indexname
   */
  const deleteIndex = (indexname: string) =>
    index.deleteIndex(indexname).runWith({ svc: search, events })

  /**
   * @param indexname
   * @param docs
   */
  const bulk = (indexname: string, docs: Record<string, unknown>[]) =>
    index.bulk(indexname, docs).runWith({ svc: search, events })

  /**
   * @param indexname
   * @param q
   */
  const query = (
    indexname: string,
    q: Parameters<SearchPort['query']>[0]['q'],
  ) => index.query(indexname, q).runWith({ svc: search, events })

  /**
   * @param index
   * @param key
   * @param doc
   */
  const indexDoc = (index: string, key: string, doc: Record<string, unknown>) =>
    document.indexDoc(index, key, doc).runWith({ svc: search, events })

  /**
   * @param index
   * @param key
   */
  const getDoc = (index: string, key: string) =>
    document.getDoc(index, key).runWith({ svc: search, events })

  /**
   * @param index
   * @param key
   * @param doc
   */
  const updateDoc = (
    index: string,
    key: string,
    doc: Record<string, unknown>,
  ) => document.updateDoc(index, key, doc).runWith({ svc: search, events })

  /**
   * @param index
   * @param key
   */
  const removeDoc = (index: string, key: string) =>
    document.removeDoc(index, key).runWith({ svc: search, events })

  return Object.freeze({
    createIndex,
    deleteIndex,
    bulk,
    query,
    indexDoc,
    getDoc,
    updateDoc,
    removeDoc,
  })
}
