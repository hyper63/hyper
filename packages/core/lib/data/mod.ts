import type { DataPort } from '../../deps.ts'
import type { EventsManager } from '../../types.ts'

import * as db from './db.ts'
import * as doc from './doc.ts'

export default function ({
  data,
  events,
}: {
  data: DataPort
  events: EventsManager
}) {
  /**
   * @param {string} name
   */
  const createDatabase = (name: string) => db.create(name).runWith({ svc: data, events })

  /**
   * @param {string} name
   */
  const destroyDatabase = (name: string) => db.remove(name).runWith({ svc: data, events })

  /**
   * @param {string} db
   * @param {Object} doc
   */
  const createDocument = (db: string, document: Record<string, unknown>) =>
    doc.create(db, document).runWith({ svc: data, events })

  /**
   * @param {string} db
   * @param {string} id
   * @param {boolean?} isLegacyGetEnabled
   *
   * TODO: LEGACY_GET: set to false on next major version. Then remove on next major version
   */
  const getDocument = (db: string, id: string, isLegacyGetEnabled = true) =>
    doc.get(db, id).runWith({ svc: data, events, isLegacyGetEnabled })

  /**
   * @param {string} db
   * @param {string} id
   * @param {Object} doc
   */
  const updateDocument = (
    db: string,
    id: string,
    document: Record<string, unknown>,
  ) => doc.update(db, id, document).runWith({ svc: data, events })

  /**
   * @param {string} db
   * @param {string} id
   */
  const removeDocument = (db: string, id: string) =>
    doc.remove(db, id).runWith({ svc: data, events })

  /**
   * @param {string} dbname
   * @param {object} query
   */
  const query = (dbname: string, query: Record<string, unknown>) =>
    db.query(dbname, query).runWith({ svc: data, events })

  /**
   * @param {string} dbname
   * @param {string} name
   * @param {string[]} fields
   */
  const index = (dbname: string, name: string, fields: string[]) =>
    db.index(dbname, name, fields).runWith({ svc: data, events })

  /**
   * @param {string} dbname,
   * @param {object} options
   */
  const listDocuments = (dbname: string, options: Record<string, unknown>) =>
    db.list(dbname, options).runWith({ svc: data, events })

  /**
   * @param {string} dbname,
   * @param {object[]} docs
   */
  const bulkDocuments = (dbname: string, docs: Record<string, unknown>[]) =>
    db.bulk(dbname, docs).runWith({ svc: data, events })

  return Object.freeze({
    createDatabase,
    destroyDatabase,
    createDocument,
    getDocument,
    updateDocument,
    removeDocument,
    query,
    index,
    listDocuments,
    bulkDocuments,
  })
}
