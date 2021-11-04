const service = "cache";

export default function (hyper) {
  return Object.freeze({
    /**
     * @param {string} key
     * @param {Object} value
     * @param {string} ttl - time to live
     */
    add: (key, value, ttl) =>
      hyper({ service, method: "POST", body: { key, value, ttl } }),
    /**
     * @param {string} key
     */
    get: (key) => hyper({ service, method: "GET", resource: key }),
    /**
     * @param {string} key
     */
    remove: (key) => hyper({ service, method: "DELETE", resource: key }),
    /**
     * @param {string} key
     * @param {Object} value
     * @param {string} [ttl]
     */
    set: (key, value, ttl) => {
      if (ttl) {
        return hyper({
          service,
          method: "PUT",
          resource: key,
          params: { ttl },
          body: value,
        });
      } else {
        return hyper({
          service,
          method: "PUT",
          resource: key,
          body: value,
        });
      }
    },
    /**
     * @param {string} pattern
     */
    query: (pattern = "*") =>
      hyper({
        service,
        method: "POST",
        action: "_query",
        params: { pattern },
      }),
  });
}
