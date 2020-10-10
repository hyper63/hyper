const store = require("./store");
const doc = require("./doc");

module.exports = ({ cache }) => {
  /**
   * @param {string} name
   * @returns {Async}
   */
  const createStore = (name) => store.create(name).runWith(cache);

  /**
   *
   * @param {string} name
   * @returns {Async}
   */
  const deleteStore = (name) => store.delete(name).runWith(cache);

  /**
   * @param {string} store
   * @param {string} key
   * @param {object} value
   * @param {string} [ttl] - short hand for time to live 30m, 1hr, 1d
   * @returns {Async}
   */
  const createDoc = (store, key, value, ttl) =>
    doc.create(store, key, value, ttl).runWith(cache);

  /**
   * @param {string} store
   * @param {string} key
   * @param {object} value
   * @returns {Async}
   */
  const updateDoc = (store, key, value, ttl) =>
    doc.update(store, key, value, ttl).runWith(cache);

  /**
   * @param {string} store
   * @param {string} key
   * @returns {Async}
   */
  const getDoc = (store, key) => doc.get(store, key).runWith(cache);

  /**
   * @param {string} name
   * @param {string} key
   * @returns {Async}
   */
  const deleteDoc = (store, key) => doc.delete(store, key).runWith(cache);

  /**
   * @param {string} name
   * @param {string} pattern
   * @returns {Async}
   */
  const queryStore = (name, pattern) =>
    store.query(name, pattern).runWith(cache);

  return {
    createStore,
    deleteStore,
    createDoc,
    updateDoc,
    getDoc,
    deleteDoc,
    queryStore,
  };
};
