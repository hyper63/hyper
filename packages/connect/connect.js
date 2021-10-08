import data from "./lib/data.js";
import cache from "./lib/cache.js";
import search from "./lib/search.js";
import { buildRequest } from "./utils.js";

export default function (connectionString) {
  const cs = new URL(connectionString);
  const br = buildRequest(cs);

  const $ = ({ svc, domain }, client, action, ...args) => {
    return client[action](...args).runWith(br(svc, domain)).toPromise();
  };

  /**
   * @param {string} domain
   */
  return function (domain) {
    return {
      data: {
        add: (body) => $({ svc: "data", domain }, data, "add", body),
        list: (params) => $({ svc: "data", domain }, data, "list", params),
        get: (id) => $({ svc: "data", domain }, data, "get", id),
        update: (id, body) =>
          $({ svc: "data", domain }, data, "update", id, body),
        remove: (id) => $({ svc: "data", domain }, data, "remove", id),
        query: (selector, options) =>
          $({ svc: "data", domain }, data, "query", selector, options),
        bulk: (docs) => $({ svc: "data", domain }, data, "bulk", docs),
        create: () => $({ svc: "data", domain }, data, "create"),
        destroy: (confirm) =>
          $({ svc: "data", domain }, data, "destroy", confirm),
        index: (name, fields) =>
          $({ svc: "data", domain }, data, "index", name, fields),
      },
      cache: {
        create: () => $({ svc: "cache", domain }, cache, "create"),
        destroy: (confirm) =>
          $({ svc: "cache", domain }, cache, "destroy", confirm),
        add: (key, value, ttl) =>
          $({ svc: "cache", domain }, cache, "add", key, value, ttl),
        remove: (key) => $({ svc: "cache", domain }, cache, "remove", key),
        get: (key) => $({ svc: "cache", domain }, cache, "get", key),
        set: (key, value, ttl) =>
          $({ svc: "cache", domain }, cache, "set", key, value, ttl),
        query: (pattern) =>
          $({ svc: "cache", domain }, cache, "query", pattern),
      },
      search: {
        create: (fields, storeFields) =>
          $({ svc: "search", domain }, search, "create", fields, storeFields),
        destroy: (confirm) =>
          $({ svc: "search", domain }, search, "destroy", confirm),
        add: (key, doc) =>
          $({ svc: "search", domain }, search, "add", key, doc),
        remove: (key) => $({ svc: "search", domain }, search, "remove", key),
        get: (key) => $({ svc: "search", domain }, search, "get", key),
        update: (key, doc) =>
          $({ svc: "search", domain }, search, "update", key, doc),
        query: (query, options) =>
          $({ svc: "search", domain }, search, "query", query, options),
        load: (docs) => $({ svc: "search", domain }, search, "load", docs),
      },
      info: {
        isCloud: cs.protocol === "cloud:",
        services: () => br("_root").toPromise(),
      },
    };
  };
}
