import { opine, spider } from './deps.js'

export default {
  app: opine,
  adapters: [
    { port: 'crawler', plugins: [spider()]}
  ]
}