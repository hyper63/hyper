
const { applyTo, filter, compose, map, is, reduce, defaultTo, fromPairs, reverse } = require('ramda')


/**
 * Given a list of plugins, compose the plugin.load()
 * resulting in a portConfig obj
 *
 * @param {[]} plugins - a list of plugins
 */
function loadAdapterConfig (plugins = []) {
  return compose(
    reduce((acc, plugin) => defaultTo(acc, plugin.load(acc)), {}),
    filter(plugin => is(Function, plugin.load))
  )(plugins)
}

/**
 * Given a list of plugins, and the adapterConfig built as a result
 * of composing plugin.load(), compose the plugin.link(), resulting in
 * a port interface
 *
 * ? should we build the entire interface?
 *
 * @param {[]} plugins - a list of plugins
 * @param {{}} adapterConfig - the config obj for the adapter
 */
function linkPlugins (plugins, adapterConfig) {
  return compose(
    links => links.reduce((a, b) => ({
      /**
       * We spread here, so that plugins may just partially implement
       * a port interface. This allows the use of multiple plugins
       * to produce the *complete* port interface, while also achieving the
       * "Onion" wrapping of each method
       */
      ...a,
      ...b(a)
    }), {}),
    reverse,
    map(
      applyTo(adapterConfig)
    ),
    map(plugin => plugin.link.bind(plugin)),
    filter(plugin => is(Function, plugin.link))
  )(plugins)
}

function initAdapter (portAdapter) {
  const { plugins } = portAdapter
  return compose(
    adapterConfig => linkPlugins(plugins, adapterConfig),
    loadAdapterConfig
  )(plugins || [])
}

/**
 * Given a list of port nodes, generate a port for each node, keyed
 * off of the port field on each node
 *
 * @param {[]} adapters - a list of port nodes from a hyper63 config
 */
module.exports = function initAdapters(adapters) {
  return compose(
    fromPairs,
    map(adapterNode => [adapterNode.port, initAdapter(adapterNode)])
  )(adapters)
}
