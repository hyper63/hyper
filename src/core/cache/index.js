const Async = require("crocks/Async");
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
  const createDoc = (store, key, value, ttl = "10m") =>
    doc.create(store, key, value, ttl).runWith(cache);

  /**
   * @param {string} store
   * @param {string} key
   * @param {object} value
   * @returns {Promise<object>}
   */
  function updateDoc(store, key, value) {
    doc.update(store, key, value).runWith(cache);
  }

  /**
   *
   */
  function getDoc(store, key) {
    doc.get(store, key).runWith(cache);
  }

  /**
   *
   */
  function deleteDoc(store, key) {
    doc.delete(store, key).runWith(cache);
  }

  /**
   * @param {string} store
   * @param {Array<string>} keys
   * @returns {Object}
   *
   */
  function getDocs(store, keys) {
    return Promise.resolve({ docs: [] });
  }

  /**
   * @param {string} store
   * @param {string} start
   * @param {string} end
   */
  function getDocsByRange(store, start, end) {
    return Promise.resolve({ docs: [] });
  }

  return {
    createStore,
    deleteStore,
    createDoc,
    updateDoc,
    getDoc,
    deleteDoc,
    getDocs,
    getDocsByRange,
  };
};

// validators

function validateName(name) {
  // verify that the name does not contains spaces
  // verify that the name does not contain slashes
  // verify that the name contains URI friendly characters
  // should return a Either Right or Left
  return false;
}

function validateResult(result) {
  return false;
}
