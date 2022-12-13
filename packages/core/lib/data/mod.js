import * as db from "./db.js";
import * as doc from "./doc.js";

export default function ({ data, events }) {
  /**
   * @param {string} name
   * @returns {Async}
   */
  const createDatabase = (name) =>
    db.create(name).runWith({ svc: data, events });

  /**
   * @param {string} name
   * @returns {Async}
   */
  const destroyDatabase = (name) =>
    db.remove(name).runWith({ svc: data, events });

  /**
   * @param {string} db
   * @param {Object} doc
   * @returns {Async}
   */
  const createDocument = (db, document) =>
    doc.create(db, document).runWith({ svc: data, events });

  /**
   * @param {string} db
   * @param {string} id
   * @param {boolean?} isLegacyGetEnabled
   * @returns {Async}
   *
   * TODO: LEGACY_GET: set to false on next major version. Then remove on next major version
   */
  const getDocument = (db, id, isLegacyGetEnabled = true) =>
    doc.get(db, id).runWith({ svc: data, events, isLegacyGetEnabled });

  /**
   * @param {string} db
   * @param {string} id
   * @param {Object} doc
   * @returns {Async}
   */
  const updateDocument = (db, id, document) =>
    doc.update(db, id, document).runWith({ svc: data, events });

  /**
   * @param {string} db
   * @param {string} id
   * @returns {Async}
   */
  const removeDocument = (db, id) =>
    doc.remove(db, id).runWith({ svc: data, events });

  /**
   * @param {string} dbname
   * @param {object} query
   * @returns {Async}
   */
  const query = (dbname, query) =>
    db.query(dbname, query).runWith({ svc: data, events });

  /**
   * @param {string} dbname
   * @param {object} index
   * @returns {Async}
   */
  const index = (dbname, name, fields) =>
    db.index(dbname, name, fields).runWith({ svc: data, events });

  /**
   * @param {string} dbname,
   * @param {object} options
   * @returns {Async}
   */
  const listDocuments = (dbname, options) =>
    db.list(dbname, options).runWith({ svc: data, events });

  const bulkDocuments = (dbname, docs) =>
    db.bulk(dbname, docs).runWith({ svc: data, events });

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
  });
}
