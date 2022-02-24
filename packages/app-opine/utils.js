import { R } from "./deps.js";

const { propEq, allPass, complement, has, pick } = R;

const sanitizeErr = pick(["ok", "status", "msg"]);

const isProduction = () => {
  const env = Deno.env.get("DENO_ENV");
  // Default to production behavior if no DENO_ENV is set
  return !env || env === "production";
};

/**
 * See https://github.com/hyper63/hyper/issues/470
 * for strategy
 */
export const fork = (res, code, m) =>
  m.fork(
    (err) => {
      res.setStatus(500).send(isProduction() ? sanitizeErr(err) : err);
    },
    (result) => {
      let status = code || 200; // fallback to 200
      /**
       * Overwrite the status with the status
       * from the HyperErr if defined
       */
      if (isHyperErr(result)) {
        status = result.status || 500; // fallback to 500 for HyperErr
      }

      res.setStatus(status).send(result);
    },
  );

export const isMultipartFormData = (contentType) => {
  contentType = contentType || "";
  return contentType.startsWith("multipart/form-data");
};

export const isFile = (path) => {
  return path.split("/").pop().indexOf(".") > -1;
};

export const isHyperErr = allPass([
  propEq("ok", false),
  /**
   * should not have an _id.
   * Otherwise it's a document ie data.retrieveDocument
   * or cache.getDoc
   */
  complement(has("_id")),
]);
