const { merge } = require('ramda')
const adapter = require('./adapter')

/**
 * hyper63 fs plugin for the storage port. This plugin is an adapter that
 * uses the file system to store files for the storage port in hyper63.
 * 
 * ## Setup
 * 
 * ``` sh
 * yarn add @hyper63/adapter-fs
 * ```
 * 
 * ``` js
 * const fs = require('@hyper63/adapter-fs')
 * 
 * module.exports = {
 *  adapters: [
 *    ...
 *    { port: 'storage', plugins: [fs({dir: './storage'})]}
 *  ]
 * }
 * ```
 * 
 * ## Usage
 * 
 * see https://purple-elephants.surge.sh 
 * 
 * storage section
 */
module.exports = function (config) {
  return ({
    id: 'fs',
    port: 'storage',
    load: merge(config),
    link: ({dir}) => _ => adapter(dir)
  })
}