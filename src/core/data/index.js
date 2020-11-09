import * as db from './db'
import * as doc from './doc'

export default ({ data }) => {
  /**
   * @param {string} name
   * @returns {Async}
   */
  const createDatabase = (name) => db.create(name).runWith(data);

  /**
   * @param {string} name
   * @returns {Async}
   */
  const destroyDatabase = (name) => db.remove(name).runWith(data);

  /**
   * @param {string} db
   * @param {Object} doc
   * @returns {Async}
   */
  const createDocument = (db, document) =>
    doc.create(db, document).runWith(data);

  /**
   * @param {string} db
   * @param {string} id
   * @returns {Async}
   */
  const getDocument = (db, id) => doc.get(db, id).runWith(data);

  /**
   * @param {string} db
   * @param {string} id
   * @param {Object} doc
   * @returns {Async}
   */
  const updateDocument = (db, id, document) =>
    doc.update(db, id, document).runWith(data);

  /**
   * @param {string} db
   * @param {string} id
   * @returns {Async}
   */
  const removeDocument = (db, id) => doc.remove(db, id).runWith(data);

  /**
   * @param {string} dbname
   * @param {object} query
   * @returns {Async}
   */
  const query = (dbname, query) => db.query(dbname, query).runWith(data);

  /**
   * @param {string} dbname
   * @param {object} index
   * @returns {Async}
   */
  const index = (dbname, index) => db.index(dbname, index).runWith(data);

  return Object.freeze({
    createDatabase,
    destroyDatabase,
    createDocument,
    getDocument,
    updateDocument,
    removeDocument,
    query,
    index,
  });
};
