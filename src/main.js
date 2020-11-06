import { loadPorts } from './ports'
import { initAdapters } from './utils/plugins'
import { compose, prop, omit } from 'ramda'

async function main () {
  const config = await import(process.cwd() + '/hyper63.config')
  // TODO: validate config

  const services = compose(
    loadPorts,
    initAdapters,
    prop('adapters')
  )(config)

  // IDEA: maybe app can be either express, serverless, or graphql implementations
  // IDEA: could app be a port type? 
  //   return services.app(without('app', services))
  //   then each app implementation would simply be an another adapter
  //   like hyper63-adapter-express
  //        hyper63-adapter-graphql
  //        hyper63-adapter-architect

  // initialize app with services
  const app = services.app(omit(['app'], services))
  // return app
  return app
}

main()