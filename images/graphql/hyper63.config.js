// app
const graphql = require('@hyper63/app-graphql')

// adapters
const memory = require('@hyper63/adapter-memory')
const pouchdb = require('@hyper63/adapter-pouchdb')
const fs = require('@hyper63/adapter-fs')
const hooks = require('@hyper63/adapter-hooks')

module.exports = {
  app: graphql(),
  adapters: [
    { port: 'cache', plugins: [ memory() ] },
    { port: 'data', plugins: [ pouchdb({ dir: process.env.DATA })]},
    { port: 'storage', plugins: [ fs({ dir: process.env.DATA })]},
    { port: 'hooks', plugins: [ 
      hooks([{
        matcher: '*',
        target: 'http://127.0.0.1:9200/log/_doc'
      }])
    ]}
  ]
}
