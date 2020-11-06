import redis from './src/adapters/redis'
import expressApp from './src/adapters/express'

export default {
  adapters: [
    { port: 'app', plugins: [ expressApp() ]},
    { port: 'cache', plugins: [ redis() ] }
  ]
}