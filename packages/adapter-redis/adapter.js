import { crocks, R } from "./deps.js";

const { Async } = crocks;
const { always, append, identity, ifElse, isNil, map, not, remove } = R;

const createKey = (store, key) => `${store}_${key}`;

export default function (client) {
  let stores = [];
  // redis commands
  // key: Promise<string>
  const get = Async.fromPromise(client.get.bind(client));
  // key, value, { px, ex }: Promise<string>
  const set = Async.fromPromise(client.set.bind(client));
  // key, key, key: Promise<string[]>
  const del = Async.fromPromise(client.del.bind(client));
  // key: Promise<string[]>
  const keys = Async.fromPromise(client.keys.bind(client));
  // cursor, { type, pattern }: Promise<[string, string[]]>
  const scan = Async.fromPromise(client.scan.bind(client));

  const index = () => {
    console.log("stores", stores);
    return Promise.resolve(stores);
  };

  /**
   * @param {string} name
   * @returns {Promise<object>}
   */
  const createStore = (name) =>
    Async.of([])
      .map(append(createKey("store", name)))
      .map(append("active"))
      .chain((args) => set(...args))
      .map((v) => {
        stores = append(name, stores);
        return v;
      })
      .map(always({ ok: true }))
      .toPromise();

  /**
   * @param {string} name
   * @returns {Promise<object>}
   */
  const destroyStore = (name) =>
    del(createKey("store", name))
      .chain(() => keys(name + "_*"))
      .chain(
        ifElse(
          (keys) => keys.length > 0,
          (args) => del(...args),
          (keys) => Async.of(keys),
        ),
      )
      .map((v) => {
        stores = remove([name], stores);
        return v;
      })
      .map(always({ ok: true }))
      .toPromise();

  /**
   * @param {CacheDoc}
   * @returns {Promise<object>}
   */
  const createDoc = ({ store, key, value, ttl }) =>
    Async.of([])
      .map(append(createKey(store, key)))
      .map(append(JSON.stringify(value)))
      .map(
        ifElse(
          () => not(isNil(ttl)),
          append(({ px: ttl })),
          identity,
        ),
      )
      .chain((args) => set(...args))
      .map(() => ({
        ok: true,
        doc: value,
      }))
      .toPromise();

  /**
   * @param {CacheDoc}
   * @returns {Promise<object>}
   */
  const getDoc = ({ store, key }) =>
    get(createKey(store, key)).chain((v) => {
      if (!v) {
        return Async.Rejected({
          ok: false,
          status: 404,
          msg: "document not found",
        });
      }
      return Async.Resolved(JSON.parse(v));
    })
      .toPromise();

  /**
   * @param {CacheDoc}
   * @returns {Promise<object>}
   */
  const updateDoc = ({ store, key, value, ttl }) =>
    Async.of([])
      .map(append(createKey(store, key)))
      .map(append(JSON.stringify(value)))
      .map(
        ifElse(
          () => not(isNil(ttl)),
          append({ px: ttl }),
          identity,
        ),
      )
      .chain((args) => set(...args))
      .map(() => ({
        ok: true,
      }))
      .toPromise();

  /**
   * @param {CacheDoc}
   * @returns {Promise<object>}
   */
  const deleteDoc = ({ store, key }) =>
    del(createKey(store, key)).map(always({ ok: true })).toPromise();

  /**
   * @param {CacheQuery}
   * @returns {Promise<object>}
   */
  const listDocs = async ({ store, pattern = "*" }) => {
    const matcher = `${store}_${pattern}`;
    return await scan(0, { pattern: matcher })
      .chain(getKeys(scan, matcher))
      .chain(getValues(get, store))
      .map(formatResponse)
      .toPromise();
  };

  return Object.freeze({
    index,
    createStore,
    destroyStore,
    createDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    listDocs,
  });
}

function formatResponse(docs) {
  return { ok: true, docs };
}

function getKeys(scan, matcher) {
  return function repeat([cursor, keys]) {
    return cursor === "0"
      ? Async.Resolved(keys)
      : scan(cursor, { pattern: matcher })
        .chain(repeat)
        .map((v) => keys.concat(v));
  };
}

function getValues(get, store) {
  return function (keys) {
    return Async.all(
      map((key) =>
        get(key).map((v) => ({
          key: key.replace(`${store}_`, ""),
          value: JSON.parse(v),
        })), keys),
    );
  };
}
