const { identity } = require('ramda')
const adapter = require('./adapter')

/**
 * hyper63 search plugin for the search port. This plugin is an adapter that
 * uses the minisearch npm module for the search port in hyper63.
 * 
 * ## Setup
 * 
 * ``` sh
 * yarn add @hyper63/adapter-minisearch
 * ```
 * 
 * ``` js
 * const minisearch = require('@hyper63/adapter-minisearch')
 * 
 * module.exports = {
 *  adapters: [
 *    ...
 *    { port: 'search', plugins: [minisearch()]}
 *  ]
 * }
 * ```
 * 
 * ## Usage
 * 
 * see https://purple-elephants.surge.sh 
 * 
 * search section
 */
module.exports = function memory(config) {
  return ({
    id: 'minisearch',
    port: 'search',
    load: identity,
    link: _ => _ => adapter()
  })
}