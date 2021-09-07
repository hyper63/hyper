import data from './lib/data.js'
import cache from './lib/cache.js'

export default function (connectionString) {
  const cs = new URL(connectionString);
  const createToken = (u, p) => `${u}:${p}`; // need to change to create jwt
  const isHyperCloud = cs.protocol === "cloud:";

  const buildRequest = (service) => {
    const protocol = isHyperCloud ? "https:" : cs.protocol;

    let headers = {
      "Content-Type": "application/json",
    };

    headers = cs.password !== ""
      ? {
        ...headers,
        Authorization: `Bearer ${createToken(cs.username, cs.password)}`,
      }
      : headers;

    return new Request(
      `${protocol}//${cs.host}${isHyperCloud ? cs.pathname : ""}${"/" +
      service}${!isHyperCloud ? cs.pathname : ""}`,
      {
        headers,
      },
    );
  };

  /**
   * @param {string} domain
   */
  return function (domain = "default") {
    return {
      data: {
        add: (body) => data.add(body).runWith(buildRequest("data")),
        list: (params) => data.list(params).runWith(buildRequest("data")),
        get: (id) => data.get(id).runWith(buildRequest("data")),
        update: (id, body) =>
          data.update(id, body).runWith(buildRequest("data")),
        remove: (id) => data.remove(id).runWith(buildRequest("data")),
        query: (selector, options) =>
          data.query(selector, options).runWith(buildRequest("data")),
        bulk: (docs) => data.bulk(docs).runWith(buildRequest("data")),
        create: () => data.create().runWith(buildRequest("data")),
        destroy: (confirm) =>
          data.destroy(confirm).runWith(buildRequest("data")),
        index: (name, fields) =>
          data.index(name, fields).runWith(buildRequest("data")),
      },
      cache: {
        create: () => cache.create().runWith(buildRequest("cache")),
        destroy: (confirm) =>
          cache.destroy(confirm).runWith(buildRequest("cache")),
        add: (key, value, ttl) =>
          cache.add(key, value, ttl).runWith(buildRequest("cache")),
        remove: (key) => cache.remove(key).runWith(buildRequest("cache")),
        get: (key) => cache.get(key).runWith(buildRequest("cache")),
        set: (key, value, ttl) => cache.set(key, value, ttl).runWith(buildRequest('cache')),
        query: (pattern) => cache.query(pattern).runWith(buildRequest('cache'))
      },
      search: {
        create: (fields, storeFields) => search.create(fields, storeFields).runWith(buildRequest('search')),
        destroy: (confirm) => search.destroy(confirm).runWith(buildRequest('search'))
      },
      info: {
        isCloud: isHyperCloud,
      },
    };
  };
}
