const memory = require('@hyper63/adapter-memory')
const pouchdb = require('@hyper63/adapter-pouchdb')

const express = require('@hyper63/app-express')
const hooks = require('@hyper63/adapter-hooks')

module.exports = {
  app: express,
  adapters: [
    { port: 'cache', plugins: [memory()]},
    { port: 'data', plugins: [pouchdb({dir: './data'})]},    
    { port: 'hooks', plugins: [ 
      hooks([{
        matcher: '*',
        target: 'http://127.0.0.1:5984/logs'
      }])
    ]}
    
  ]
}
