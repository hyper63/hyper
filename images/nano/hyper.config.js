import { app, fs, hooks as _hooks, minisearch, pouchdb, queue, sqlite } from './deps.js'

import { DIR } from './dir.js'

export default {
  app,
  adapters: [
    {
      port: 'data',
      plugins: [pouchdb({ dir: DIR })],
    },
    {
      port: 'cache',
      plugins: [sqlite({ dir: DIR })],
    },
    {
      port: 'storage',
      plugins: [fs({ dir: DIR })],
    },
    {
      port: 'search',
      plugins: [minisearch({ dir: DIR })],
    },
    {
      port: 'queue',
      plugins: [queue({ dir: DIR })],
    },
  ],
}
