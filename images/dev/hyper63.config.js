const memory = require('@hyper63/adapter-memory')
const pouchdb = require('@hyper63/adapter-pouchdb')
const jwt = require('./middleware/jwt')
const express = require('@hyper63/app-express')
const minisearch = require('@hyper63/adapter-minisearch')
const beequeue = require('@hyper63/adapter-beequeue').default


module.exports = {
  app: express,
  adapters: [
    { port: 'cache', plugins: [memory()]},
    { port: 'data', plugins: [pouchdb({dir: process.env.DATA})]},
    { port: 'search', plugins: [minisearch()]},
    { port: 'queue', plugins: [beequeue({redis: 'redis://localhost:6379'})]}
  ],
  middleware: [jwt]
}
