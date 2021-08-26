import { R } from "../deps.js";

const { compose } = R;

export function forward(delimiter) {
  /**
   * Forward the request to hyper, by rewriting the url to combine the app name and service name
   * using the delimiter to join
   *
   * A __hyper flag is set on the request object that is later checked in subsequent middleware
   * to indicate the request to a root service route originated from a hyper forwarded request
   *
   * @param {string} service - the type of the hyper service
   * @param {string} delimiter - the delimiter to use between the app name and service name
   * @returns
   */
  function buildForwardToService(service) {
    return (app) => {
      // Forward app url to namespaced service urls
      app.use(`/:app/${service}/*`, (req, res, next) => {
        const parts = req.params[0].split("/");
        const [name, ...rest] = parts;

        // Route rewrite
        req.url = `/${service}/${req.params.app}${delimiter}${name}/${
          rest.join("/")
        }`;

        console.log("url: ", req.url);
        // TODO: maybe make some sort of key or identifier?
        // Set forward flag
        req.__hyper = true;

        return app._router.handle(req, res, next);
        //next();
      });

      // Forward index routes of each service
      app.use(`/:app/${service}`, (req, res, next) => {
        req.url = `/${service}`;

        return app._router.handle(req, res, next);
      });

      // Only accept traffic at root service routes from forwarded requests
      app.use(`/${service}/*`, (req, res, next) => {
        // didn't originate from a hyper forward, so 404 for now
        if (!req.__hyper) {
          return res.setStatus(501).send({ ok: false, msg: "Not Implemented" });
        }

        next();
      });

      return app;
    };
  }

  return (app) =>
    compose(
      buildForwardToService("data"),
      buildForwardToService("cache"),
      buildForwardToService("storage"),
      buildForwardToService("search"),
      buildForwardToService("queue"),
      buildForwardToService("crawler"),
    )(app);
}
