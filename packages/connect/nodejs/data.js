const service = "data";

/**
 * @param {function} hyper
 */
export default function (hyper) {
  return Object.freeze({
    /**
     * @param {Object} doc
     */
    add: (doc) => hyper({ service, method: "POST", body: doc }),
    /**
     * @param {string} id - document identifier
     */
    get: (id) => hyper({ service, method: "GET", resource: id }),
    /**
     * @param {string} id - document identifier
     * @param {Object} doc - json document
     */
    update: (id, doc) =>
      hyper({ service, method: "PUT", resource: id, body: doc }),
    /**
     * @param {string} id - document identifier
     */
    remove: (id) => hyper({ service, method: "DELETE", resource: id }),
    /**
     * @param {Object} args - list options
     */
    list: (args) => hyper({ service, method: "GET", params: args }),
    /**
     * @param {Object} selector - query selector
     * @param {Object} options - query options (sort, use_index, fields, etc)
     */
    query: (selector, options) =>
      hyper({
        service,
        method: "POST",
        action: "_query",
        body: { selector, ...options },
      }),
    /**
     * @param {Array<Object>} docs - collection of json documents
     */
    bulk: (docs) =>
      hyper({ service, method: "POST", action: "_bulk", body: docs }),
  });
}
