const loadPorts = require('./ports')
const wrapCore = require('./lib')
const initAdapters = require('./utils/plugins')
const eventMgr = require('./utils/event-mgr')
const { compose, prop, assoc, propOr } = require('ramda')

/**
 * @returns {function} - listen function
 */
 function main (config) {
  //const config = (await import(process.cwd() + '/hyper63.config')).default
  config = !config ? require(process.cwd() + '/hyper63.config') : config

  // TODO: validate config
  const services = compose(
     // add eventMgr to services
    wrapCore, 
    assoc('middleware', propOr([], 'middleware', config)),
    assoc('events', eventMgr()),
    loadPorts,
    initAdapters,
    prop('adapters')
  )(config)

  let app = config.app(services)

  // return app
  return app
}

module.exports = main
