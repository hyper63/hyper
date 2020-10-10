const cacheCore = require("./cache");
const dataCore = require("./data");

/**
 * main core module
 *
 * this module takes services and environment
 * and passes them to each core module
 *
 */
module.exports = (services) => {
  const cache = cacheCore(services);
  const data = dataCore(services);
  // consider reader monad to
  // add config and services
  return {
    cache,
    data,
  };
};
