const { merge } = require("ramda");
const adapter = require("./adapter");

/**
 * hyper63 data plugin for the data port. This plugin is an adapter that
 * uses the pouchdb npm module for the data port in hyper63.
 *
 * ## Setup
 *
 * ``` sh
 * yarn add @hyper63/adapter-pouchdb
 * ```
 *
 * ``` js
 * const pouchdb = require('@hyper63/adapter-pouchdb')
 *
 * module.exports = {
 *  adapters: [
 *    ...
 *    { port: 'data', plugins: [pouchdb()]}
 *  ]
 * }
 * ```
 *
 * ## Usage
 *
 * see https://purple-elephants.surge.sh
 *
 * data section
 */

module.exports = function pouchdb(config) {
  return ({
    id: "pouchdb",
    port: "data",
    load: merge(config),
    link: ({ dir }) => () => adapter(dir),
  });
};
