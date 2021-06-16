import { adapter } from "./adapter";
import { asyncFetch, createHeaders, handleResponse } from "./async-fetch.js";

/**
 * @param {object} config
 * @returns {object}
 */
export default function CouchDataAdapter(config) {
  /**
   * @param {object} env
   */
  function load() {
    return config;
  }

  /**
   * @param {object} env
   * @returns {function}
   */
  function link(env = { url: "http://localhost:5984" }) {
    /**
     * @param {object} adapter
     * @returns {object}
     */
    return function () {
      // parse url
      const config = new URL(env.url);

      return adapter({
        config,
        asyncFetch: asyncFetch(fetch),
        headers: createHeaders(config.username, config.password),
        handleResponse,
      });
    };
  }

  return Object.freeze({
    id: "couchdb-data-adapter",
    port: "data",
    load,
    link,
  });
}
