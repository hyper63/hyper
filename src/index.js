const express = require("express");
const helmet = require("helmet");
const core = require("./bind")();

const app = express();
const port = process.env.PORT || 6363;

const cache = require("./api/cache");

// middleware to inject core modules into request object
const bindCore = (req, res, next) => {
  req.cache = core.cache;
  next();
};

app.use(helmet());

//app.use("/micro/data", require("./api/data"));

// cache api
app.get("/cache", cache.index);
app.put("/cache/:name", bindCore, cache.createStore);
app.delete("/cache/:name", bindCore, cache.deleteStore);
app.get("/cache/:name/_query", bindCore, cache.queryStore);
app.post("/cache/:name/_query", bindCore, cache.queryStore);
app.post("/cache/:name", express.json(), bindCore, cache.createDocument);
app.get("/cache/:name/:key", bindCore, cache.getDocument);
app.put("/cache/:name/:key", express.json(), bindCore, cache.updateDocument);
app.delete("/cache/:name/:key", bindCore, cache.deleteDocument);

//app.use("/micro/storage", require("./api/storage"));
//app.use("/micro/hooks", require("./api/hooks"));

app.get("/", (req, res) => res.send({ name: "Atlas" }));

if (!module.parent) {
  app.listen(port);
  console.log(`Atlas is running on port ${port}`);
}

module.exports = app;
