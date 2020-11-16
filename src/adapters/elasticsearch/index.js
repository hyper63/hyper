import { merge } from 'ramda'
import adapter from './adapter'
import { asyncFetch, createHeaders, handleResponse} from './async-fetch'

export default function (config) {
  return Object.freeze({
    id: 'elasticsearch',
    port: 'search',
    load: merge(config),
    link: env => _ => {
      if (!env.url) { throw new Error('Config URL is required elastic search')}
      const config = new URL(env.url)
      const headers = createHeaders(config.username, config.password)
      return adapter({config, asyncFetch, headers, handleResponse})
    }
  })
}