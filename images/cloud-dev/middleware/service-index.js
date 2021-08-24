import { R } from "../deps.js";

const { compose, map } = R;
const SERVICES = ["data", "cache", "storage", "search", "queue"];

export function serviceIndex() {
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
      app.get(`/:app/${serviceName}`, (_req, res) => {
        return res.setStatus(501).send({ message: "Not Implemented" });
      });

      return app;
    };
  }

  return (app) =>
    compose(
      ...map(buildIndexRouteForService, SERVICES),
    )(app);
}
