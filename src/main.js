import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import multer from 'multer'
import bind from './bind'

const upload = multer({dest: '/tmp/hyper63/uploads'})

const app = express()
const port = process.env.PORT || 6363

const cache = require('./api/cache')
const data = require('./api/data')
const storage = require('./api/storage')

const bindCore = (req, res, next) => {
  req.cache = core.cache,
  req.data = core.data,
  req.storage = core.storage
  next()
}

app.use(helmet())
app.use(cors({credentials: true}))

// data api
app.get("/data", data.index);
app.put("/data/:db", bindCore, data.createDb);
app.delete("/data/:db", bindCore, data.removeDb);
app.post("/data/:db", express.json(), bindCore, data.createDocument);
app.get("/data/:db/:id", bindCore, data.getDocument);
app.put("/data/:db/:id", express.json(), bindCore, data.updateDocument);
app.delete("/data/:db/:id", bindCore, data.deleteDocument);
app.post("/data/:db/_query", bindCore, data.queryDb);

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

// storage api
app.get("/storage", storage.index);
app.put("/storage/:name", bindCore, storage.makeBucket);
app.delete("/storage/:name", bindCore, storage.removeBucket);
app.post("/storage/:name", upload.single("file"), bindCore, storage.putObject);
app.get("/storage/:name/*", bindCore, storage.getObject);
app.delete("/storage/:name/*", bindCore, storage.removeObject);


app.get('/', (req, res) => res.send({name: 'hyper63'}))

export default app