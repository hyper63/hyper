import { R } from "../deps.js";

const {
  unapply,
  applyTo,
  filter,
  compose,
  map,
  mergeAll,
  is,
  pluck,
  pipeWith,
  reverse,
} = R;

/**
 * @param  {...() => Promise<any>} fns - variadic args of functions
 * @returns a pipeP function that can be used to compose Promise returning functions,
 * similar to calling .then or .chain
 */
const pipeP = unapply(pipeWith((fn, p) => Promise.resolve(p).then(fn)));

/**
 * Given a list of plugins, compose the plugin.load()
 * resulting in a portConfig obj
 *
 * @param {[]} plugins - a list of plugins
 */
async function loadAdapterConfig(plugins = []) {
  return await pipeP(...filter(is(Function), pluck("load", plugins)))({});
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
function linkPlugins(plugins, adapterConfig, dispatch) {
  return compose(
    (links) =>
      links.reduce((a, b) => ({
        /**
         * We spread here, so that plugins may just partially implement
         * a port interface. This allows the use of multiple plugins
         * to produce the *complete* port interface, while also achieving the
         * "Onion" wrapping of each method
         */
        ...a,
        ...b(a),
      }), {}),
    reverse,
    map(
      applyTo({ ...adapterConfig, dispatch }), // every link method receives bootstrap
    ),
    map((plugin) => plugin.link.bind(plugin)),
    filter((plugin) => is(Function, plugin.link)),
  )(plugins);
}

export async function initAdapter(portAdapter) {
  const { plugins, dispatch } = portAdapter;
  const env = await loadAdapterConfig(plugins || []);
  return linkPlugins(plugins, env, dispatch);
}

/**
 * Given a list of port nodes, generate a port for each node, keyed
 * off of the port field on each node
 *
 * @param {[]} adapters - a list of port nodes from a hyper63 config
 */
export default async function initAdapters(adapters) {
  const svcs = await Promise.all(
    map(async (adapterNode) => ({
      [adapterNode.port]: await initAdapter(adapterNode),
    }), adapters),
  );
  return mergeAll(svcs);
}
