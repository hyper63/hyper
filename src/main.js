import { loadPorts } from './ports'
import { initAdapters } from './utils/plugins'
import { default as wrapCore } from './core'
import { compose, prop, assoc } from 'ramda'
import eventMgr from './utils/event-mgr'
/**
 * @returns {function} - listen function
 */
async function main () {
  const config = (await import(process.cwd() + '/hyper63.config')).default
  // TODO: validate config
  
  const services = compose(
     // add eventMgr to services
    wrapCore, 
    assoc('events', eventMgr()),
    loadPorts,
    initAdapters,
    prop('adapters')
  )(config)

  // return app
  return config.app(services)
}

main()