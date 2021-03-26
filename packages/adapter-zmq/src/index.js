// @ts-ignore
globalThis.fetch = require('node-fetch')
const { merge } = require('ramda')
const adapter = require('./adapter')

/**
 * @func
 * plugin function for hyper linking the Queue Port
 *
 * @param {string} port
 */
module.exports = function (port) {
  return {
    id: 'zeromq',
    port: 'queue',
    load: merge({port}),
    /**
     * @param {{port: string}} env
     */
    link: (env) => 
      /**
       * @param {import('@hyper63/port-queue').QueuePort} a
       */
      (a) => 
        a ? merge(a, adapter(env)) : adapter(env) 
  }
}
    
