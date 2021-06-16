import { R } from "./deps.js";

import adapter from "./adapter.js";

const { identity } = R;

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
export default function memory() {
  return ({
    id: "minisearch",
    port: "search",
    load: identity,
    link: () => () => adapter(),
  });
}
