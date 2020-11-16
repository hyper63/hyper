// app
import express from './src/apps/express'

// adapters
import redis from './src/adapters/redis'
import couchdb from './src/adapters/couchdb'
import minio from './src/adapters/minio'
import elasticsearch from './src/adapters/elasticsearch'

export default {
  app: express,
  adapters: [
    { port: 'cache', plugins: [ redis({url: process.env.REDIS}) ] },
    { port: 'data', plugins: [ couchdb({url: process.env.COUCHDB })]},
    { port: 'storage', plugins: [ minio({url: process.env.MINIO })]},
    { port: 'search', plugins: [ elasticsearch({url: process.env.ES })]},
    // { port: 'hooks'}
  ]
}