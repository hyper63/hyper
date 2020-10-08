// TODO: get redis module
const redis = require("redis");
const Async = require("crocks/Async");

const noop = () => Async.Resolved({ ok: true });

// atlas cache implementation interface
module.exports = (env = { url: "redis://127.0.0.1:6379" }) => {
  const client = redis.createClient(env);
  const get = Async.fromNode(client.get.bind(client));
  const set = Async.fromNode(client.set.bind(client));
  const del = Async.fromNode(client.del.bind(client));

  const createKey = (store, key) => `${store}_${key}`;
  // todo add ttl support

  return {
    createStore: (name) =>
      set(createKey("store", name), "active").map(() => ({
        ok: true,
      })),
    destroyStore: noop,
    createDoc: ({ store, key, value, ttl }) =>
      set(createKey(store, key), JSON.stringify(value)).map(() => ({
        ok: true,
        doc: value,
      })),
    getDoc: ({ store, key }) =>
      get(createKey(store, key)).map((v) => {
        if (!v) {
          return { ok: false, msg: "document not found" };
        }
        return { ok: true, doc: JSON.parse(v) };
      }),
    updateDoc: ({ store, key, value, ttl }) =>
      set(createKey(store, key), JSON.stringify(value)).map((v) => ({
        ok: true,
      })),
    deleteDoc: ({ store, key }) =>
      del(createKey(store, key)).map(() => ({ ok: true })),
    close: () => {
      client.quit();
    },
  };
};
