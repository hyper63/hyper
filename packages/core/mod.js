import loadPorts from './ports.js'
import wrapCore from './lib/mod.js'
import validateConfig from './utils/config-schema.js'
import initAdapters from './utils/plugins.js'
import eventMgr from './utils/event-mgr.js'
import { exists, join, R } from './deps.js'

const { compose, prop, assoc, propOr } = R

/**
 * @returns {function} - listen function
 */
export default async function main(config) {
  config = config ||
    await getConfig('hyper.config.js') ||
    await getConfig('hyper63.config.js')

  config = validateConfig(config)

  //load methods can return promises so entire plugin svc returns a promise -tnw
  const adapters = await initAdapters(prop('adapters', config))

  const services = compose(
    // add eventMgr to services
    wrapCore,
    assoc('middleware', propOr([], 'middleware', config)),
    assoc('events', eventMgr()),
    loadPorts,
  )(adapters)

  const app = config.app(services)
  // return app
  return app
}

async function getConfig(name) {
  const path = join(Deno.cwd(), name)
  if (!(await exists(path))) {
    return
  }

  const config = (await import(path)).default
  return config
}
