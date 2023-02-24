import { Buffer, crocks, getMimeType } from '../deps.js';
import { fork, isFile, isMultipartFormData, isTrue } from '../utils.js';

const { Async } = crocks;

// GET /storage
export const index = (_req, res) =>
  res.send({ name: 'hyper63 Storage', version: '1.0', status: 'unstable' });

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
export const putObject = (fieldName = 'file') => async (req, res) => {
  /**
   * Ensure reader is closed, if defined, to prevent leaks
   * in the case of a tempfile being created
   */
  const cleanup = (_p) =>
    Async.fromPromise(async (res) => {
      if (reader && typeof reader.close === 'function') {
        await reader.close();
      }

      return _p(res);
    });

  const { params, storage } = req;

  let reader = undefined;

  const bucket = params.name;
  let object = '';
  let useSignedUrl = false;

  // Upload
  if (isMultipartFormData(req.get('content-type'))) {
    const form = req.form;
    const file = form.files(fieldName)[0];
    reader = file.content
      ? new Buffer(file.content.buffer) // from memory
      : await Deno.open(file.tempfile, { read: true }); // from tempfile if too large for memory buffer

    // object is placed at root of bucket, by default
    object = file.filename;

    // object can be placed in "subdirectories within the bucket"
    let path = form.values('path') ? form.values('path')[0] : params[0] || undefined; // fallback to url path, if defined, if form data path is not defined

    if (path) {
      /**
       * The filename, from FormData file, takes precedent over any filename in path,
       *
       * Examples:
       *
       * POST /bucket/foo/bar.jpg form-data: (file: actual.jpg) will
       * ignore `bar.jpg` and use `actual.jpg` for the filename
       * effectively acting as POST /bucket/foo form-data: (file: actual.jpg)
       *
       * POST /bucket form-data: (file: actual.jpg, path: foo/bar.jpg) will
       * ignore `bar.jpg` and use `actual.jpg` for the filename
       * effectively acting as POST /bucket/foo form-data: (file: actual.jpg)
       */
      if (isFile(path)) {
        path = path.split('/').slice(0, -1).join('/');
      }

      if (path.endsWith('/')) {
        path = path.slice(0, -1);
      }

      object = `${path}/${object}`;
    }
  } else {
    // useSignedUrl
    useSignedUrl = true;
    // TODO: Tyler. should we check if the object is a file name?
    object = params[0] || undefined; // map all falsey to undefined, then Let Storage port catch
  }

  return fork(
    res,
    201,
    storage.putObject(bucket, object, reader, useSignedUrl).bichain(
      cleanup(Promise.reject.bind(Promise)),
      cleanup(Promise.resolve.bind(Promise)),
    ),
  );
};

export const getObject = ({ params, query, storage }, res) =>
  fork(
    res,
    200,
    /**
     * ?useSignedUrl=true
     */
    storage.getObject(params.name, params[0], isTrue(query.useSignedUrl)).map(
      (result) => {
        /**
         * adapter will return JSON that contains a url
         * similar to what putObject:useSignedUrl returns
         */
        if (isTrue(query.useSignedUrl)) {
          return result;
        }

        /**
         * Get mime type and set response
         */
        const mimeType = getMimeType(params[0].split('.')[1]);
        res.set({
          'Content-Type': mimeType,
          'Transfer-Encoding': 'chunked',
        });

        return result;
      },
    ),
  );

export const removeObject = ({ params, storage }, res) =>
  fork(res, 201, storage.removeObject(params.name, params[0]));
