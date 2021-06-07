const { mergeDeepRight, defaultTo, pipe } = require('ramda')
const adapter = require('./adapter')
const { asyncFetch, createHeaders, handleResponse } = require('./async-fetch')

module.exports = function ElasticsearchAdapter (config) {
  return Object.freeze({
    id: 'elasticsearch',
    port: 'search',
    load: pipe(
      defaultTo({}),
      mergeDeepRight(config)
    ),
    link: env => () => {
      if (!env.url) { throw new Error('Config URL is required elastic search') }
      const headers = createHeaders(config.username, config.password)
      // TODO: probably shouldn't use origin, so to support mounting elasticsearch on path
      return adapter({ config: new URL(env.url), asyncFetch, headers, handleResponse })
    }
  })
}
