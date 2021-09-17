import data from './lib/data.js'
import cache from './lib/cache.js'
import search from './lib/search.js'
import { buildRequest } from './utils.js'

export default function (connectionString) {
  const cs = new URL(connectionString);
  const br = buildRequest(cs)

  const $ = (svc, client, action, ...args) => {
    return client[action](...args).runWith(br(svc)).toPromise();
  };

  /**
   * @param {string} domain
   */
  return function (domain = "default") {
    return {
      data: {
        add: (body) => $('data', data, 'add', body),
        list: (params) => $('data', data, 'list', params),
        get: (id) => $('data', data, 'get', id),
        update: (id, body) => $('data', data, 'update', id, body),
        remove: (id) => $('data', data, 'remove', id),
        query: (selector, options) => $('data', data, 'query', selector, options),
        bulk: (docs) => $('data', data, 'bulk', docs),
        create: () => $('data', data, 'create'),
        destroy: (confirm) => $('data', data, 'destroy', confirm),
        index: (name, fields) => $('data', data, 'index', name, fields),
      },
      cache: {
        create: () => $('cache', cache, 'create'),
        destroy: (confirm) => $('cache', cache, 'destroy', confirm),
        add: (key, value, ttl) => $('cache', cache, 'add', key, value, ttl),
        remove: (key) => $('cache', cache, 'remove', key),
        get: (key) => $('cache', cache, 'get', key),
        set: (key, value, ttl) => $('cache', cache, 'set', key, value, ttl),
        query: (pattern) => $('cache', cache, 'query', pattern)
      },
      search: {
        create: (fields, storeFields) => $('search', search, 'create', fields, storeFields),
        destroy: (confirm) => $('search', search, 'destroy', confirm),
        add: (key, doc) => $('search', search, 'add', key, doc),
        remove: (key) => $('search', search, 'remove', key),
        get: (key) => $('search', search, 'get', key),
        update: (key, doc) => $("search", search, "update", key, doc),
        query: (query, options) => $("search", search, "query", query, options),
        load: (docs) => $("search", search, "load", docs),
      },
      info: {
        isCloud: isHyperCloud,
      },
    };
  };
}
