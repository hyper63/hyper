const { Async } = require('crocks')
const { always, append, compose, identity, ifElse, isNil, map, not, remove } = require('ramda')


const createKey = (store, key) => `${store}_${key}`;

module.exports = function (client) {
  let stores = []
  // redis commands
  const get = Async.fromNode(client.get.bind(client));
  const set = Async.fromNode(client.set.bind(client));
  const del = Async.fromNode(client.del.bind(client));
  const keys = Async.fromNode(client.keys.bind(client));
  const scan = Async.fromNode(client.scan.bind(client));

  const index = () => {
    console.log('stores', stores)
    return Promise.resolve(stores)
  }

  /**
   * @param {string} name
   * @returns {Promise<object>}
   */
  const createStore = (name) =>
    Async.of([])
      .map(append(createKey("store", name)))
      .map(append("active"))
      .chain(set)
      .map(v => {
        stores = append(name, stores)
        return v
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
          del,
          (keys) => Async.of(keys)
        )
      )
      .map(v => {
        stores = remove([name], stores)
        return v
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
          compose(append(ttl), append("PX")),
          identity
        )
      )
      .chain(set)
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
        return Async.Rejected({ ok: false, status: 404, msg: "document not found" });
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
          compose(append(ttl), append("PX")),
          identity
        )
      )
      .chain((args) => set(...args))
      .map((v) => ({
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
    const matcher = `${store}_${pattern}`
    return scan(0, "MATCH", matcher)
      .chain(getKeys(scan, matcher))
      .chain(getValues(get, store))
      .map(formatResponse)
      .toPromise()
  }


  return Object.freeze({
    index,
    createStore,
    destroyStore,
    createDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    listDocs
  });

}


function formatResponse(docs) {
  return { ok: true, docs}
}

function getKeys(scan, matcher) {
  return function repeat([cursor, keys]) {
    return cursor === '0'
      ? Async.Resolved(keys)
      : scan(cursor, "MATCH", matcher)
          .chain(repeat)
	  .map(v => keys.concat(v))
  }
}

function getValues(get, store) {
  return function (keys) {
    return Async.all(
      map(key =>
	 get(key).map((v) =>
	 ({
	    key: key.replace(`${store}_`, ''),
	    value: JSON.parse(v)
	 })
	 )
	 , keys)
      )
  }
}
