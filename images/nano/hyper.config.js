import { app, fs, hooks as _hooks, minisearch, mongodb, queue, sqlite } from './deps.js'

import { DIR } from './dir.js'

export default {
  app,
  adapters: [
    {
      port: 'data',
      plugins: [mongodb({ dir: DIR, dirVersion: '7.0.4' })],
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
