const cacheCore = require("./cache");
const dataCore = require("./data");
const storageCore = require("./storage");

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
  const storage = storageCore(services);
  // consider reader monad to
  // add config and services
  return {
    cache,
    data,
    storage,
  };
};
