const pouchdb = require('@hyper63/adapter-pouchdb')
const express = require('@hyper63/app-express')

module.exports = {
  app: express,
  adapters: [{ port: 'data', plugins: [pouchdb()] }]
}