import * as data from "./services/data";
import * as cache from "./services/cache";
import { Hyper, HyperRequest } from "./types";
import { hyper } from "./utils/hyper-request";
import fetch, { Request, Response } from "node-fetch";
import { ifElse } from "ramda";

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
          (r) => r.headers.get("content-type").includes("application/json"),
          (r) => r.json(),
          (r) => r.text().then((msg: string) => ({ ok: r.ok, msg })),
        ),
      );

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
    },
    cache: {
      add: (key, value, ttl) =>
        Promise.resolve(h)
          .then(cache.add(key, value, ttl))
          .then(fetch)
          .then(handleResponse),
    },
  };
}
