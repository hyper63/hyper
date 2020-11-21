const { merge, omit } = require('ramda') 

module.exports = function adapter () {
  let stores = {}

  function createStore(name) {
    const store = new Map()
    stores = merge({ [name]: store }, stores)
    return Promise.resolve({ok: true})
  }

  function destroyStore(name) {
    stores = omit([name], stores)
    return Promise.resolve({ok: true})
  }

  function createDoc({store, key, value, ttl}) {
    // TODO: implement ttl
    stores[store].set(key, value)
    return Promise.resolve({ok: true})
  }

  function getDoc({store, key}) {
    return Promise.resolve({ ok: true, doc: stores[store].get(key) })
  }

  function updateDoc({store, key, value, ttl}) {
    stores[store].set(key, value)
    return Promise.resolve({ok: true})
  }

  function deleteDoc({store, key}) {
    stores[store].delete(key)
    return Promise.resolve({ok: true})
  }

  function listDocs({store, pattern}) {
    return Promise.resolve({ok: true, docs: []})
  }

  return Object.freeze({
    createStore,
    destroyStore,
    createDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    listDocs
  })
}