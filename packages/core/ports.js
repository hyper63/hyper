const cache = require('@hyper63/port-cache')
const data = require('@hyper63/port-data')
const storage = require('@hyper63/port-storage')
const search = require('@hyper63/port-search')
const queue = require('@hyper63/port-queue')

const { mapObjIndexed, reduce, ifElse } = require('ramda')

module.exports = (adapters) =>  ({
  cache: adapters.cache ? cache(adapters.cache) : null,
  data: adapters.data ? data(adapters.data) : null,
  storage: adapters.storage ? storage(adapters.storage) : null,
  search: adapters.search ? search(adapters.search) : null,
  queue: adapters.queue ? queue(adapters.queue) : null,
  hooks: adapters.hooks
})

/*
module.exports = mapObjIndexed(
  (adapter, k) => {
    if (k === 'cache') {
      return cache(adapter)
    } else if (k === 'data' ) {
      return data(adapter)
    } else if (k === 'storage') {
      return storage(adapter)
    } else if (k === 'search') {
      return search(adapter)
    } else if (k === 'hooks') {
      return v
    } else {
      // need to use the value to combine port and adapter
      let port = require(k)
      return port(adapter)
    }
  }
)
*/
