import { cors, helmet, json, R, Router } from "./deps.js";

// middleware
import upload from "./lib/upload.js";

// route handlers
import * as cache from "./api/cache.js";
import * as data from "./api/data.js";
import * as storage from "./api/storage.js";
import * as search from "./api/search.js";
import * as queue from "./api/queue.js";
import * as crawler from "./api/crawler.js";

const { compose } = R;

// Opine Router
export function hyperRouter(services) {
  /**
   * This router can be mounted onto other apps,
   * so we will want access to those req parameters
   */
  let app = Router({ mergeParams: true });
  // enable extensibility to allow
  // middleware
  app = services.middleware.length > 0
    ? compose(...services.middleware)(app)
    : app;

  // middleware to inject core modules into request object
  const bindCore = (req, _res, next) => {
    req.cache = services.cache;
    req.data = services.data;
    req.storage = services.storage;
    req.search = services.search;
    req.events = services.events;
    req.hooks = services.hooks;
    req.queue = services.queue;
    req.crawler = services.crawler;
    next();
  };

  app.use(helmet());
  app.use(cors({ credentials: true }));
  // data api
  app.get("/data", data.index);
  app.put("/data/:db", bindCore, data.createDb);
  app.delete("/data/:db", bindCore, data.removeDb);
  app.get("/data/:db", bindCore, data.listDocuments);
  app.post("/data/:db", json({ limit: "8mb" }), bindCore, data.createDocument);
  app.get("/data/:db/:id", bindCore, data.getDocument);
  app.put(
    "/data/:db/:id",
    json({ limit: "8mb" }),
    bindCore,
    data.updateDocument,
  );
  app.delete("/data/:db/:id", bindCore, data.deleteDocument);
  app.post("/data/:db/_query", json(), bindCore, data.queryDb);
  app.post("/data/:db/_index", json(), bindCore, data.indexDb);
  app.post("/data/:db/_bulk", json(), bindCore, data.bulk);

  // cache api
  app.get("/cache", bindCore, cache.index);
  app.put("/cache/:name", bindCore, cache.createStore);
  app.delete("/cache/:name", bindCore, cache.deleteStore);
  app.get("/cache/:name/_query", bindCore, cache.queryStore);
  app.post("/cache/:name/_query", bindCore, cache.queryStore);
  app.post("/cache/:name", json(), bindCore, cache.createDocument);
  app.get("/cache/:name/:key", bindCore, cache.getDocument);
  app.put("/cache/:name/:key", json(), bindCore, cache.updateDocument);
  app.delete("/cache/:name/:key", bindCore, cache.deleteDocument);

  // storage api
  app.get("/storage", storage.index);
  app.put("/storage/:name", bindCore, storage.makeBucket);
  app.delete("/storage/:name", bindCore, storage.removeBucket);
  app.post("/storage/:name", upload("file"), bindCore, storage.putObject);
  app.get("/storage/:name/*", bindCore, storage.getObject);
  app.delete("/storage/:name/*", bindCore, storage.removeObject);

  // search api
  app.get("/search", search.index);
  app.put("/search/:index", json(), bindCore, search.createIndex);
  app.delete("/search/:index", bindCore, search.deleteIndex);
  app.post("/search/:index", json(), bindCore, search.indexDoc);
  app.get("/search/:index/:key", bindCore, search.getDoc);
  app.put("/search/:index/:key", json(), bindCore, search.updateDoc);
  app.delete("/search/:index/:key", bindCore, search.removeDoc);
  app.post("/search/:index/_query", json(), bindCore, search.query);
  app.post("/search/:index/_bulk", json(), bindCore, search.bulk);

  // queue api
  app.get("/queue", bindCore, queue.index);
  app.put("/queue/:name", json(), bindCore, queue.create);
  app.delete("/queue/:name", bindCore, queue.del);
  app.post("/queue/:name", json(), bindCore, queue.post);
  app.get("/queue/:name", bindCore, queue.list);
  app.post("/queue/:name/_cancel", bindCore, queue.cancel);

  // crawler api
  app.put("/crawler/:bucket/:name", json(), bindCore, crawler.upsert);
  app.get("/crawler/:app/:name", bindCore, crawler.get);
  app.post("/crawler/:app/:name/_start", bindCore, crawler.start);
  //app.post('/crawler/:app/:name/_doc', json(), bindCore, crawler.post);
  app.delete("/crawler/:app/:name", bindCore, crawler.del);

  app.get("/error", (_req, _res, next) => {
    console.log("oooooo");
    next(new Error("Error occuried"));
  });

  app.get("/", (_req, res) => {
    res.send({
      name: "hyper63",
      version: "unstable",
      services: Object
        .keys(services)
        .filter((k) => k !== "events")
        .filter((k) => k !== "middleware")
        .filter((k) => k !== "hooks")
        .filter((k) => services[k] !== null),
    });
  });

  // TODO: Tyler. Add a favicon?
  app.get("/favicon.ico", (_req, res) => res.sendStatus(204));

  // All of these args need to be specified, or it won't be invoked on error
  app.use((err, _req, res, _next) => {
    if (err) {
      console.log(JSON.stringify({
        type: "ERROR",
        date: new Date().toISOString(),
        payload: err.message,
      }));
      res.setStatus(500).json({ ok: false, msg: err.message });
    }
  });

  return app;
}
