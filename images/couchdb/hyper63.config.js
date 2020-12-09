// app
const express = require('@hyper63/app-express')
const jwt = require('./middleware/jwt')

// adapters
const couchdb = require('@hyper63/adapter-couchdb')

module.exports = {
  app: express,
  adapters: [
    { port: 'data', plugins: [ couchdb({ url: process.env.COUCHDB_SERVER})]}
  ],
  middleware: [jwt]
}

