const db = require('./db.js')
const doc = require('./doc.js')

module.exports = ({ data, events }) => {
  /**
   * @param {string} name
   * @returns {Async}
   */
  const createDatabase = (name) => db.create(name).runWith({ svc: data, events });

  /**
   * @param {string} name
   * @returns {Async}
   */
  const destroyDatabase = (name) => db.remove(name).runWith({ svc: data, events });

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
   * @returns {Async}
   */
  const getDocument = (db, id) => doc.get(db, id).runWith({ svc: data, events });

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
  const removeDocument = (db, id) => doc.remove(db, id).runWith({ svc: data, events });

  /**
   * @param {string} dbname
   * @param {object} query
   * @returns {Async}
   */
  const query = (dbname, query) => db.query(dbname, query).runWith({ svc: data, events });

  /**
   * @param {string} dbname
   * @param {object} index
   * @returns {Async}
   */
  const index = (dbname, index) => db.index(dbname, index).runWith({ svc: data, events });

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
