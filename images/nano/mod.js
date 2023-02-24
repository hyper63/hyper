import { parse } from './deps.js'
import { main } from './main.js'

function gatherFlags(args) {
  let { domain, experimental, purge = '', data, cache, storage } = args

  const services = { data, cache, storage }
  if (purge && typeof purge === 'boolean') {
    // purge all services
    purge = services
  } else {
    // only purge service indicated in comma delimited string
    purge = purge.split(',').map((s) => s.trim()).reduce(
      (acc, type) => ({ ...acc, [type]: services[type] }),
      {},
    )
  }

  return { domain, purge, services, experimental }
}

await main(gatherFlags(parse(Deno.args)))
