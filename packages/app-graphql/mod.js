// These are here, so to not bog down deps.js if consumer imports mount.js instead of mod.js
import { lookup as getMimeType } from 'https://deno.land/x/media_types@v2.8.4/mod.ts';
import { default as helmet } from 'https://cdn.skypack.dev/helmet@^4.6.0';
import { opineCors as cors } from 'https://deno.land/x/cors@v1.2.1/mod.ts';
import { Buffer } from 'https://deno.land/std@0.106.0/io/buffer.ts';
import { MultipartReader } from 'https://deno.land/std@0.106.0/mime/mod.ts';
import { exists } from 'https://deno.land/std@0.106.0/fs/exists.ts';

import { crocks, opine } from './deps.js';

import { gqlRouter } from './lib/graphql/router.js';
import { STORAGE_PATH } from './lib/constants.js';

const { Async } = crocks;

function getObject(storage) {
  return ({ params }, res) => {
    storage.getObject(params.name, params[0]).fork(
      (e) => res.setStatus(500).send({ ok: false, msg: e.message }),
      async (reader) => {
        // get mime type
        const mimeType = getMimeType(params[0].split('.')[1]);
        res.set({
          'Content-Type': mimeType,
          'Transfer-Encoding': 'chunked',
        });
        res.setStatus(200);

        await res.send(reader);
      },
    );
  };
}

/**
 * requires multi-part form post
 * fields: file, [path]
 */
function putObject(storage) {
  return async ({ file, params, body }, res) => {
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
        if (typeof reader.close === 'function') {
          await reader.close();
        }

        return _constructor(res);
      });

    storage.putObject(params.name, object, reader).bichain(
      cleanup(Promise.reject.bind(Promise)),
      cleanup(Promise.resolve.bind(Promise)),
    ).fork(
      (err) => {
        if (err.status) {
          return res.setStatus(err.status).send({
            ok: false,
            msg: err.message,
          });
        }
        res.setStatus(500).send(err);
      },
      (result) => res.setStatus(201).send(result),
    );
  };
}

// Upload middleware for handling multipart/formdata ie. files
function multipartMiddleware(fieldName = 'file') {
  const TMP_DIR = '/tmp/hyper/uploads';

  return async (req, _res, next) => {
    let boundary;

    const contentType = req.get('content-type');
    if (contentType.startsWith('multipart/form-data')) {
      boundary = contentType.split(';')[1].split('=')[1];
    }

    // Ensure tmp dir exists. Otherwise MultipartReader throws error when reading form data
    if (!(await exists(TMP_DIR))) {
      await Deno.mkdir(TMP_DIR, { recursive: true });
    }

    const form = await new MultipartReader(req.body, boundary).readForm({
      maxMemory: 10 << 20,
      dir: TMP_DIR,
    });

    // emulate multer
    req.file = form.file(fieldName);

    next();
  };
}

// TODO: Maybe allow passing custom schema here?
export default function () {
  return function (services) {
    const app = opine();
    app.use(helmet());
    app.use(cors({ credentials: true }));
    app.get('/', (_req, res) => res.send({ name: 'hyper' }));

    // GraphQL shouldn't handle file uploads, so we provide paths for streaming and uploading files
    // See https://www.apollographql.com/blog/backend/file-uploads/file-upload-best-practices/
    app.get(`/${STORAGE_PATH}/:name/*`, getObject(services.storage));
    app.post(
      `/${STORAGE_PATH}/:name`,
      multipartMiddleware(),
      putObject(services.storage),
    );

    app.use('/graphql', gqlRouter()(services));

    const port = parseInt(Deno.env.get('PORT')) || 6363;

    // Start server
    app.listen(port);
    console.log('hyper graphql service listening on port ', port);
  };
}
