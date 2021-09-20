import * as store from "./store.js";
import * as doc from "./doc.js";

export default function ({ cache, events }) {
  const index = () => store.index().runWith({ svc: cache, events });

  /**
   * @param {string} name
   * @returns {Async}
   */
  const createStore = (name) =>
    store.create(name).runWith({ svc: cache, events });

  /**
   * @param {string} name
   * @returns {Async}
   */
  const deleteStore = (name) => store.del(name).runWith({ svc: cache, events });

  /**
   * @param {string} store
   * @param {string} key
   * @param {object} value
   * @param {string} [ttl] - short hand for time to live 30m, 1hr, 1d
   * @returns {Async}
   */
  const createDoc = (store, key, value, ttl) =>
    doc.create(store, key, value, ttl).runWith({ svc: cache, events });

  /**
   * @param {string} store
   * @param {string} key
   * @param {object} value
   * @returns {Async}
   */
  const updateDoc = (store, key, value, ttl) =>
    doc.update(store, key, value, ttl).runWith({ svc: cache, events });

  /**
   * @param {string} store
   * @param {string} key
   * @returns {Async}
   */
  const getDoc = (store, key) =>
    doc.get(store, key).runWith({ svc: cache, events });

  /**
   * @param {string} name
   * @param {string} key
   * @returns {Async}
   */
  const deleteDoc = (store, key) =>
    doc.del(store, key).runWith({ svc: cache, events });

  /**
   * @param {string} name
   * @param {string} pattern
   * @returns {Async}
   */
  const queryStore = (name, pattern) =>
    store.query(name, pattern).runWith({ svc: cache, events });

  return Object.freeze({
    index,
    createStore,
    deleteStore,
    createDoc,
    updateDoc,
    getDoc,
    deleteDoc,
    queryStore,
  });
}
