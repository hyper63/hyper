const loadPorts = require('./ports')
const wrapCore = require('./lib')
const initAdapters = require('./utils/plugins')
const eventMgr = require('./utils/event-mgr')
const { compose, prop, assoc } = require('ramda')

/**
 * @returns {function} - listen function
 */
async function main () {
  //const config = (await import(process.cwd() + '/hyper63.config')).default
  const config = require(process.cwd() + '/hyper63.config')
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