// TODO: get redis module
const YoRedis = require("yoredis");
const Async = require("crocks/Async");

const noop = () => Async.Resolved({ ok: true });

// atlas cache implementation interface
module.exports = (env = { url: "redis://127.0.0.1:6379" }) => {
  const redis = new YoRedis({ url: env.url });
  const call = Async.fromPromise(redis.call);
  const createKey = (store, key) => `${store}_${key}`;
  // todo add ttl support
  const set = ({ store, key, value, ttl }) =>
    call("set", createKey(store, key), JSON.stringify(value));
  return {
    createStore: noop,
    destroyStore: noop,
    createDoc: noop,
    getDoc: noop,
    updateDoc: noop,
    deleteDoc: noop,
    /*
    createDoc: set,
    getDoc: async ({ store, key }) =>
      JSON.parse(await call("get", createKey(store, key))),
    updateDoc: set,
    deleteDoc: ({ store, key }) => call("del", createKey(store, key)),
    */
  };
};
