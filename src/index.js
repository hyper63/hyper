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
app.get("/micro/cache", cache.index);
app.put("/micro/cache/:name", bindCore, cache.createStore);
app.delete("/micro/cache/:name", bindCore, cache.deleteStore);
app.post("/micro/cache/:name", express.json(), bindCore, cache.createDocument);
app.get("/micro/cache/:name/:key", bindCore, cache.getDocument);
app.put(
  "/micro/cache/:name/:key",
  express.json(),
  bindCore,
  cache.updateDocument
);
app.delete("/micro/cache/:name/:key", bindCore, cache.deleteDocument);

//app.use("/micro/storage", require("./api/storage"));
//app.use("/micro/hooks", require("./api/hooks"));

app.get("/", (req, res) => res.send({ name: "Atlas" }));

if (!module.parent) {
  app.listen(port);
  console.log(`Atlas is running on port ${port}`);
}

module.exports = app;
