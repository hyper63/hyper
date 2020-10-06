// TODO: get redis module
const YoRedis = require("yoredis");
const Async = require("crocks/Async");

const noop = () => Async.Resolved({ ok: true });

// atlas cache implementation interface
module.exports = (env = { url: "redis://127.0.0.1:6379" }) => {
  const redis = new YoRedis(env);
  const call = Async.fromPromise(redis.call.bind(redis));
  const createKey = (store, key) => `${store}_${key}`;
  // todo add ttl support
  const set = ({ store, key, value, ttl }) =>
    call("set", createKey(store, key), JSON.stringify(value)).map(() => ({
      ok: true,
    }));
  return {
    createStore: noop,
    destroyStore: noop,
    createDoc: set,
    getDoc: ({ store, key }) =>
      call("get", createKey(store, key)).map((v) => JSON.parse(v)),
    updateDoc: set,
    deleteDoc: ({ store, key }) =>
      call("del", createKey(store, key)).map(() => ({ ok: true })),
    close: () => redis.end(),
  };
};
