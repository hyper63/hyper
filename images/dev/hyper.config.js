import { app, dndb, memory, fs, minisearch } from './deps.js'


export default {
  app,
  adapters: [
    {
      port: 'data',
      plugins: [dndb()]
    },
    {
      port: 'cache',
      plugins: [memory()]
    },
    {
      port: 'storage',
      plugins: [fs()]
    },
    {
      port: 'search',
      plugins: [minisearch()]
    }
  ]
}