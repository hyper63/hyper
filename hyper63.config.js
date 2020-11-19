// app
import express from './src/apps/express'

// adapters
import redis from './src/adapters/redis'
import couchdb from './src/adapters/couchdb'
import minio from './src/adapters/minio'
import elasticsearch from './src/adapters/elasticsearch'
import hyper63hooks from './src/adapters/hooks'

export default {
  app: express,
  adapters: [
    { port: 'cache', plugins: [ redis({url: process.env.REDIS}) ] },
    { port: 'data', plugins: [ couchdb({url: process.env.COUCHDB })]},
    { port: 'storage', plugins: [ minio({url: process.env.MINIO })]},
    { port: 'search', plugins: [ elasticsearch({url: process.env.ES })]},
    { port: 'hooks', plugins: [ 
      hyper63hooks([{
        matcher: '*',
        target: 'http://127.0.0.1:9200/log/_doc'
      }])
    ]}
  ],
  logs: {
    level: 'INFO' // ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL
  } 
}

