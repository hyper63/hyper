import { isHyperErr, R } from './deps.js';

const { pick } = R;

const sanitizeErr = pick(['ok', 'status', 'msg']);

const isProduction = () => {
  const env = Deno.env.get('DENO_ENV');
  // Default to production behavior if no DENO_ENV is set
  return !env || env === 'production';
};

/**
 * See https://github.com/hyper63/hyper/issues/470
 * for strategy
 */
export const fork = (res, code, m) =>
  m.fork(
    (err) => {
      console.log('fatal error received from core');
      console.log(err);
      res.setStatus(500).send(isProduction() ? 'Internal Server Error' : err);
    },
    (result) => {
      let status = code || 200; // fallback to 200
      /**
       * Overwrite the status with the status
       * from the HyperErr if defined
       */
      if (isHyperErr(result)) {
        status = result.status || 500; // fallback to 500 for HyperErr
        result = isProduction() ? sanitizeErr(result) : result; // sanitize the HyperErr
      }

      res.setStatus(status).send(result);
    },
  );

export const isMultipartFormData = (contentType) => {
  contentType = contentType || '';
  return contentType.startsWith('multipart/form-data');
};

export const isFile = (path) => {
  path = path || '/';
  return path.split('/').pop().indexOf('.') > -1;
};

/**
 * Add an empty string to coerce val to
 * a string, then compare to string 'true'
 */
export const isTrue = (val) => (val + '').trim() === 'true';
