import * as data from "./services/data";
import * as cache from "./services/cache";
import * as search from "./services/search";
import * as info from "./services/info";

import { Hyper, HyperRequest } from "./types";
import { hyper } from "./utils/hyper-request";
import fetch, { Request, Response } from "node-fetch";
import { assoc, contains, ifElse } from "ramda";

export function connect(
  CONNECTION_STRING: string,
  // deno-lint-ignore no-inferrable-types
  domain: string = "default",
): Hyper {
  const config = new URL(CONNECTION_STRING);

  const h = async (hyperRequest: HyperRequest) => {
    const { url, options } = await hyper(config, domain)(hyperRequest);
    return new Request(url, options);
  };

  const handleResponse = (response: Response) =>
    Promise.resolve(response)
      .then(
        ifElse(
          (r: Response) =>
            contains(
              "application/json",
              r.headers.get("content-type") as string,
            ),
          (r: Response) => r.json(),
          (r: Response) => r.text().then((msg: string) => ({ ok: r.ok, msg })),
        ),
      )
      .then((r) => response.ok ? r : assoc("status", response.status, r))
      .then((r) => response.status >= 500 ? Promise.reject(r) : r);

  //const log = (x: any) => (console.log(x), x);

  return {
    data: {
      add: (body) =>
        Promise.resolve(h)
          .then(data.add(body))
          .then(fetch)
          .then(handleResponse),
      get: (id) =>
        Promise.resolve(h)
          .then(data.get(id))
          .then(fetch)
          .then(handleResponse),
      list: (options) =>
        Promise.resolve(h)
          .then(data.list(options))
          .then(fetch)
          .then(handleResponse),
      update: (id, doc) =>
        Promise.resolve(h)
          .then(data.update(id, doc))
          .then(fetch)
          .then(handleResponse),
      remove: (id) =>
        Promise.resolve(h)
          .then(data.remove(id))
          .then(fetch)
          .then(handleResponse),
      query: (selector, options) =>
        Promise.resolve(h)
          .then(data.query(selector, options))
          .then(fetch)
          .then(handleResponse),
      bulk: (docs) =>
        Promise.resolve(h)
          .then(data.bulk(docs))
          .then(fetch)
          .then(handleResponse),
      index: (indexName, fields) =>
        Promise.resolve(h)
          .then(data.index(indexName, fields))
          .then(fetch)
          .then(handleResponse),
      create: () =>
        Promise.resolve(h)
          .then(data.create())
          .then(fetch)
          .then(handleResponse),
      destroy: (confirm) =>
        Promise.resolve(h)
          .then(data.destroy(confirm))
          .then(fetch)
          .then(handleResponse),
    },
    cache: {
      add: (key, value, ttl) =>
        Promise.resolve(h)
          .then(cache.add(key, value, ttl))
          .then(fetch)
          .then(handleResponse),
      get: (key) =>
        Promise.resolve(h)
          .then(cache.get(key))
          .then(fetch)
          .then(handleResponse),
      remove: (key) =>
        Promise.resolve(h)
          .then(cache.remove(key))
          .then(fetch)
          .then(handleResponse),
      set: (key, value, ttl) =>
        Promise.resolve(h)
          .then(cache.set(key, value, ttl))
          .then(fetch)
          .then(handleResponse),
      query: (pattern) =>
        Promise.resolve(h)
          .then(cache.query(pattern))
          .then(fetch)
          .then(handleResponse),
      create: () =>
        Promise.resolve(h)
          .then(cache.create())
          .then(fetch)
          .then(handleResponse),
      destroy: (confirm) =>
        Promise.resolve(h)
          .then(cache.destroy(confirm))
          .then(fetch)
          .then(handleResponse),
    },
    search: {
      add: (key, doc) =>
        Promise.resolve(h)
          .then(search.add(key, doc))
          .then(fetch)
          .then(handleResponse),
      remove: (key) =>
        Promise.resolve(h)
          .then(search.remove(key))
          .then(fetch)
          .then(handleResponse),
      get: (key) =>
        Promise.resolve(h)
          .then(search.get(key))
          .then(fetch)
          .then(handleResponse),
      update: (key, doc) =>
        Promise.resolve(h)
          .then(search.update(key, doc))
          .then(fetch)
          .then(handleResponse),
      query: (query, options) =>
        Promise.resolve(h)
          .then(search.query(query, options))
          .then(fetch)
          .then(handleResponse),
      load: (docs) =>
        Promise.resolve(h)
          .then(search.load(docs))
          .then(fetch)
          .then(handleResponse),
      create: (fields, storeFields) =>
        Promise.resolve(h)
          .then(search.create(fields, storeFields))
          .then(fetch)
          .then(handleResponse),
      destroy: (confirm) =>
        Promise.resolve(h)
          .then(search.destroy(confirm))
          .then(fetch)
          .then(handleResponse),
    },
    info: {
      services: () =>
        Promise.resolve(h)
          .then(info.services())
          .then(fetch)
          .then(handleResponse),
    },
  };
}
