import { fork } from "../utils";
import fs from "fs";
import mime from "mime";

// GET /storage
exports.index = (req, res) =>
  res.send({ name: "hyper63 Storage", version: "1.0", status: "unstable" });

// PUT /storage/:name - make bucket
exports.makeBucket = ({ params, storage }, res) =>
  fork(res, 201, storage.makeBucket(params.name));

// DELETE /storage/:name - remove bucket
exports.removeBucket = ({ params, storage }, res) =>
  fork(res, 201, storage.removeBucket(params.name));

// POST /storage/:name - put object
/**
 * requires multi-part form post
 * fields: file, [path]
 */
exports.putObject = ({ file, params, body, storage }, res) => {
  let object = file.originalname;
  if (body.path) {
    object = `${body.path}/${file.originalname}`;
  }
  return fork(
    res,
    201,
    storage.putObject(params.name, object, fs.createReadStream(file.path))
  );
};

exports.getObject = ({ params, storage }, res) => {
  storage.getObject(params.name, params[0]).fork(
    (e) => res.status(500).send({ ok: false, msg: e.message }),
    (s) => {
      // get mime type
      const mimeType = mime.getType(params[0].split(".")[1]);
      res.writeHead(200, {
        "Content-Type": mimeType,
        "Transfer-Encoding": "chunked",
      });
      s.pipe(res);
    }
  );
};

exports.removeObject = ({ params, storage }, res) =>
  fork(res, 201, storage.removeObject(params.name, params[0]));
