import redis from './src/adapters/redis'
import express from './src/apps/express'

export default {
  app: express,
  adapters: [
    { port: 'cache', plugins: [ redis({url: process.env.REDIS}) ] },
    // { port: 'data'},
    // { port: 'storage'},
    // { port: 'search'},
    // { port: 'hooks'}
  ]
}