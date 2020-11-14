import { identity } from 'ramda'
import adapter from './adapter'
import { asyncFetch, createHeaders, handleResponse} from './async-fetch'

export default function (config) {
  return Object.freeze({
    id: 'elasticsearch',
    port: 'search',
    load: identity,
    link: env => _ => {
      const config = new URL(env.url)
      const headers = createHeaders(config.username, config.password)
      return adapter({config, asyncFetch, headers, handleResponse})
    }
  })
}