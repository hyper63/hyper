import { loadPorts } from './ports'
import { initAdapters } from './utils/plugins'
import { default as wrapCore } from './core'
import { compose, prop } from 'ramda'

/**
 * @returns {function} - listen function
 */
async function main () {
  const config = (await import(process.cwd() + '/hyper63.config')).default
  // TODO: validate config
  
  const services = compose(
    wrapCore, 
    loadPorts,
    initAdapters,
    prop('adapters')
  )(config)
  // return app
  return config.app(services)
}

main()