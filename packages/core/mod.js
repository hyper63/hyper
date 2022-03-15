import { exists, join, R } from "./deps.js";

import loadPorts from "./ports.js";
import wrapCore from "./lib/mod.js";
import validateConfig from "./utils/config-schema.js";
import { initAdapter } from "./utils/plugins.js";

// deno-lint-ignore no-unused-vars
import { HyperEvent, HyperEventDispatched } from "./events.ts";

const { compose, assoc, propOr, evolve, map, mergeAll } = R;

/**
 * @returns {function} - listen function
 */
export default async function main(config) {
  config = config ||
    await getConfig("hyper.config.js") ||
    await getConfig("hyper63.config.js");

  config = validateConfig(config);

  // assign each adapter chain a uuid
  const { adapters: adapterChains } = evolve({
    adapters: map(assoc("uuid", crypto.randomUUID())),
  }, config);

  const adapters = Promise.all(
    adapterChains.map(
      (acc, async ({ port, plugins, uuid }) => {
        /**
         * The dispatch created for this particular service
         * @param {HyperEventDispatched} evt
         */
        const dispatch = (evt) =>
          dispatchEvent(
            new HyperEvent({ type: evt.type, payload: evt.payload, uuid }),
          );
  
        return {
          [port]: await initAdapter({ port, plugins, dispatch }),
        };
      }),
      {},
    )
  ).then(mergeAll);

  const services = compose(
    // add eventMgr to services
    wrapCore,
    assoc("middleware", propOr([], "middleware", config)),
    loadPorts,
  )(adapters);

  /**
   * @param {HyperEvent} evt
   */
  function handleHyperEvent(evt) {
    const { detail: { type, uuid, payload } } = evt;
    console.log({ type, uuid, payload });
  }
  addEventListener("hyper", handleHyperEvent);

  const app = config.app(services);
  // return app
  return app;
}

async function getConfig(name) {
  const path = join(Deno.cwd(), name);
  if (!(await exists(path))) {
    return;
  }

  const config = (await import(path)).default;
  return config;
}
