import loadPorts from "./ports.js";
import wrapCore from "./lib/mod.js";
import validateConfig from "./utils/config-schema.js";
import initAdapters from "./utils/plugins.js";
import eventMgr from "./utils/event-mgr.js";
import { R } from "./deps.js";

const { compose, prop, assoc, propOr } = R;

/**
 * @returns {function} - listen function
 */
export default function main(config) {
  // const config = (await import(process.cwd() + '/hyper63.config')).default
  config = !config ? require(process.cwd() + "/hyper63.config") : config;
  config = validateConfig(config);

  // TODO: validate config
  const services = compose(
    // add eventMgr to services
    wrapCore,
    assoc("middleware", propOr([], "middleware", config)),
    assoc("events", eventMgr()),
    loadPorts,
    initAdapters,
    prop("adapters"),
  )(config);

  const app = config.app(services);

  // return app
  return app;
}
