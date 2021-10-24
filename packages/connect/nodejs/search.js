const service = "search";

export default function (hyper) {
  return Object.freeze({
    /**
     * @param {string} key
     * @param {Object} doc
     */
    add: (key, doc) =>
      hyper({
        service,
        method: "POST",
        body: { key, doc },
      }),
    /**
     * @param {string} key
     */
    remove: (key) =>
      hyper({
        service,
        method: "DELETE",
        resource: key,
      }),
    /**
     * @param {string} key
     */
    get: (key) =>
      hyper({
        service,
        method: "GET",
        resource: key,
      }),
    update: (key, doc) =>
      hyper({
        service,
        method: "PUT",
        resource: key,
        body: doc,
      }),
    /**
     * @typedef {Object} Options
     * @property {Array<string>} [fields]
     * @property {Object} [filter]
     *
     * @param {string} query
     * @param {Options} options
     */
    query: (query, { fields, filter }) => {
      const body = { query };
      if (fields) body.fields = fields;
      if (filter) body.filter = filter;

      return hyper({
        service,
        method: "POST",
        action: "_query",
        body,
      });
    },
    /**
     * @param {Array<Object>} docs
     */
    load: (docs) =>
      hyper({
        service,
        method: "POST",
        action: "_bulk",
        body: docs,
      }),
  });
}
