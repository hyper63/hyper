import { R } from "./deps.js";

import adapter from "./adapter.js";

const { merge } = R;

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
export default function (config) {
  return ({
    id: "fs",
    port: "storage",
    load: merge(config),
    link: ({ dir }) => () => adapter(dir),
  });
}
