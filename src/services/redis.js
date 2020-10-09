// TODO: get redis module
const redis = require("redis");
const Async = require("crocks/Async");
const {
  append,
  ifElse,
  isNil,
  not,
  compose,
  identity,
  always,
} = require("ramda");

const noop = () => Async.Resolved({ ok: true });

/*
const append = (value) => (array) => [...array, value];
const ifElse = (pred, then, do_else) => (v) => (pred(v) ? then(v) : do_else(v));
const isNull = (v) => v === null || v === undefined;
const not = (pred) => !pred;
const compose = (f, g) => (v) => f(g(v));
const identity = (v) => v;
const always = (c) => () => c;
*/
const createKey = (store, key) => `${store}_${key}`;

/**
 * @typedef {Object} CacheDoc
 * @property {string} store
 * @property {string} key
 * @property {Object} [value] - optional
 * @property {number} [ttl] - optional - milliseconds
 *
 * @typedef {Object} CacheQuery
 * @property {string} store
 * @property {string} pattern
 */

// atlas cache implementation interface
module.exports = (env = { url: "redis://127.0.0.1:6379" }) => {
  const client = redis.createClient(env);
  // redis commands
  const get = Async.fromNode(client.get.bind(client));
  const set = Async.fromNode(client.set.bind(client));
  const del = Async.fromNode(client.del.bind(client));
  const keys = Async.fromNode(client.keys.bind(client));
  const scan = Async.fromNode(client.scan.bind(client));

  /**
   * @param {string} name
   * @returns {Async}
   */
  const createStore = (name) =>
    Async.of([])
      .map(append(createKey("store", name)))
      .map(append("active"))
      .chain(set)
      .map(always({ ok: true }));

  /**
   * @param {string} name
   * @returns {Async}
   */
  const destroyStore = (name) =>
    del(createKey("store", name))
      .chain(() => keys(name + "_*"))
      .chain(
        ifElse(
          (keys) => keys.length > 0,
          del,
          (keys) => Async.of(keys)
        )
      )
      .map(always({ ok: true }));

  /**
   * @param {CacheDoc}
   * @returns {Async}
   */
  const createDoc = ({ store, key, value, ttl }) =>
    Async.of([])
      .map(append(createKey(store, key)))
      .map(append(JSON.stringify(value)))
      .map(
        ifElse(
          () => not(isNil(ttl)),
          compose(append(ttl), append("PX")),
          identity
        )
      )
      .chain(set)
      .map(() => ({
        ok: true,
        doc: value,
      }));

  /**
   * @param {CacheDoc}
   * @returns {Async}
   */
  const getDoc = ({ store, key }) =>
    get(createKey(store, key)).map((v) => {
      if (!v) {
        return { ok: false, msg: "document not found" };
      }
      return { ok: true, doc: JSON.parse(v) };
    });

  /**
   * @param {CacheDoc}
   * @returns {Async}
   */
  const updateDoc = ({ store, key, value, ttl }) =>
    Async.of([])
      .map(append(createKey(store, key)))
      .map(append(JSON.stringify(value)))
      .map(
        ifElse(
          () => not(isNil(ttl)),
          compose(append(ttl), append("PX")),
          identity
        )
      )
      .chain((args) => set(...args))
      .map((v) => ({
        ok: true,
      }));

  /**
   * @param {CacheDoc}
   * @returns {Async}
   */
  const deleteDoc = ({ store, key }) =>
    del(createKey(store, key)).map(always({ ok: true }));

  /**
   * @param {CacheQuery}
   * @returns {Async}
   */
  const listDocs = ({ store, pattern = "*" }) =>
    scan(0, "MATCH", store + "_" + pattern)
      .chain(([cursor, keys]) =>
        Async.all(
          keys.map((key) =>
            get(key).map((v) => ({
              key: key.replace(`${store}_`, ""),
              doc: JSON.parse(v),
            }))
          )
        )
      )
      .map((docs) => {
        return {
          ok: true,
          docs,
        };
      });

  return Object.freeze({
    createStore,
    destroyStore,
    createDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    listDocs,
    close: () => {
      client.quit();
    },
  });
};
