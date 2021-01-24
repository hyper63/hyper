const cache = require('@hyper63/port-cache')
const data = require('@hyper63/port-data')
const storage = require('@hyper63/port-storage')
const search = require('@hyper63/port-search')

module.exports = (adapters) =>  ({
  cache: adapters.cache ? cache(adapters.cache) : null,
  data: adapters.data ? data(adapters.data) : null,
  //data: adapters.data,
  storage: adapters.storage ? storage(adapters.storage) : null,
  search: adapters.search ? search(adapters.search) : null,
  hooks: adapters.hooks
})