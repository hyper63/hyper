export const fork = (res, code, m) =>
  m.fork(
    (error) => {
      const status = error.status || 500;
      res.setStatus(status).send({
        ...error,
        ok: false,
        msg: error.msg || error.message,
      });
    },
    (result) => res.setStatus(code).send(result),
  );
