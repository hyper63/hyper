const isProduction = () => {
  const env = Deno.env.get("DENO_ENV");
  // Default to production behavior if no DENO_ENV is set
  return !env || env === "production";
};

export const fork = (res, code, m) =>
  m.fork(
    (error) => {
      const status = error.status || 500;
      res.setStatus(status).send({
        // sanitize response, if production.
        ...(isProduction() ? {} : error),
        ok: false,
        msg: error.msg || error.message,
      });
    },
    (result) => res.setStatus(code).send(result),
  );

export const isMultipartFormData = (contentType) => {
  contentType = contentType || "";
  return contentType.startsWith("multipart/form-data");
};

export const isFile = (path) => {
  return path.split("/").pop().indexOf(".") > -1;
};
