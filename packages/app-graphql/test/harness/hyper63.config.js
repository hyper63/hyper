// app
import graphql from '../..'

// adapters
import redis from '../../../../adapters/redis'
import couchdb from '../../../../adapters/couchdb'
import minio from '../../../../adapters/minio'

export default {
  app: graphql(),
  adapters: [
    { port: 'cache', plugins: [ redis({url: process.env.REDIS}) ] },
    { port: 'data', plugins: [ couchdb({url: process.env.COUCHDB })]},
    { port: 'storage', plugins: [ minio({url: process.env.MINIO })]}
  ]
}