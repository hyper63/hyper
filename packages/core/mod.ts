import { exists, join, R } from './deps.ts'

import validateConfig from './utils/config-schema.ts'
import initAdapters from './utils/plugins.js'
import { parseHyperServices } from './ports.ts'
import { eventMgr } from './utils/event-mgr.ts'
import wrapCore from './lib/mod.ts'

import type { Config } from './model.ts'

const { compose, assoc, propOr } = R

async function getConfig(name: string) {
  const path = join(Deno.cwd(), name)
  if (!(await exists(path))) return

  const config = (await import(path)).default
  return config
}

export * from './types.ts'

/**
 * Parse a hyper configuration, bootstrapping the driven adapters
 * wrapping with core business logic, then starting the driving
 * adatper
 *
 * Returns a bootstrapped hyper server
 */
export default async function main(config: Config) {
  config = config ||
    (await getConfig('hyper.config.js')) ||
    (await getConfig('hyper63.config.js'))

  config = validateConfig(config)

  const adapters = await initAdapters(config.adapters)

  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  const services = compose(
    wrapCore,
    assoc('middleware', propOr([], 'middleware', config)),
    assoc('events', eventMgr()),
    parseHyperServices,
  )(adapters)

  const app = config.app(services)

  /**
   * The bootstrapped hyper server
   */
  return app
}
