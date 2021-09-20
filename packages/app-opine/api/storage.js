import { Buffer, crocks, getMimeType } from "../deps.js";
import { fork } from "../utils.js";

const { Async } = crocks;

// GET /storage
export const index = (_req, res) =>
  res.send({ name: "hyper63 Storage", version: "1.0", status: "unstable" });

// PUT /storage/:name - make bucket
export const makeBucket = ({ params, storage }, res) =>
  fork(res, 201, storage.makeBucket(params.name));

// DELETE /storage/:name - remove bucket
export const removeBucket = ({ params, storage }, res) =>
  fork(res, 201, storage.removeBucket(params.name));

// POST /storage/:name - put object
/**
 * requires multi-part form post
 * fields: file, [path]
 */
/**
 * @param {*} param0
 * @param {*} res
 * @returns
 */
export const putObject = async ({ file, params, body, storage }, res) => {
  let object = file.filename;
  if (body.path) {
    object = `${body.path}/${file.filename}`;
  }

  const reader = file.content
    ? new Buffer(file.content.buffer) // from memory
    : await Deno.open(file.tempfile, { read: true }); // from tempfile if too large for memory buffer

  /**
   * Ensure reader is closed to prevent leaks
   * in the case of a tempfile being created
   */
  const cleanup = (_constructor) =>
    Async.fromPromise(async (res) => {
      if (typeof reader.close === "function") {
        await reader.close();
      }

      return _constructor(res);
    });

  return fork(
    res,
    201,
    storage.putObject(params.name, object, reader).bichain(
      cleanup(Promise.reject.bind(Promise)),
      cleanup(Promise.resolve.bind(Promise)),
    ),
  );
};

export const getObject = ({ params, storage }, res) => {
  storage.getObject(params.name, params[0]).fork(
    (e) => res.setStatus(500).send({ ok: false, msg: e.message }),
    async (fileReader) => {
      // get mime type
      const mimeType = getMimeType(params[0].split(".")[1]);
      res.set({
        "Content-Type": mimeType,
        "Transfer-Encoding": "chunked",
      });
      res.setStatus(200);

      await res.send(fileReader);
    },
  );
};

export const removeObject = ({ params, storage }, res) =>
  fork(res, 201, storage.removeObject(params.name, params[0]));
