import { R } from "../deps.js";

import { fork } from "../utils/fork.js";

const { compose, assoc, filter, defaultTo, __ } = R;
const SERVICES = ['data', 'cache', 'storage', 'search', 'queue']
const serviceToKeys = {
  cache: {
    method: "index",
    resource: "stores",
  },
  storage: {
    method: "listBuckets",
    resource: "buckets",
  },
  queue: {
    method: "index",
    resource: "queues",
  },
  // Data does not currently specify an index api for adapters
  // data: {
  //   method: "index",
  //   resource: "dbs",
  // },
  // Search does not currently specify an index api for adapters
  // search: {
  //   method: "index",
  //   resource: "indexes",
  // },
  // Crawler does not currently specify an index api for adapters
  // crawlers: {
  //   method: "index",
  //   resource: "crawlers",
  // },
};

export function serviceIndex(delimiter) {
  /**
   * Override the index path of the app-opine router with a custom implementation
   * that filters the resources returned from the adapter, based on the app serviceName
   * provided in request params
   *
   * A resource will _always_ begin with the `${app}${delimiter}` so we will search
   * for that at the beginning of the resource serviceName
   *
   * @param {string} serviceName - the type of the hyper service
   * @returns
   */
  function buildIndexRouteForService(serviceName) {
    return (app) => {
      // Override index routes of each service
      app.get(`/:app/${serviceName}`, (req, res) => {
        const { params } = req;

        const { method, resource } = serviceToKeys[serviceName];
        const service = services[serviceName];

        return fork(
          res,
          200,
          service[method]()
            .map(defaultTo([]))
            .map(
              filter((name) => name.indexOf(`${params.app}${delimiter}`) === 0),
            )
            .map(assoc(resource, __, {
              name: serviceName,
              version: "0.0.1", // TODO: Tyler. what should this version be?
            })),
        );
      });

      return app;
    };
  }

  return (app) =>
    compose(
      ...(SERVICES.map((name) =>
        buildIndexRouteForService(
          name,
        )
      )),
    )(app);
}