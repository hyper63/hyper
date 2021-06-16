export const fork = (res, code, m) =>
  m.fork(
    (error) => {
      if (error.status) {
        return res.setStatus(error.status).send({
          ok: false,
          msg: error.message,
        });
      }
      res.setStatus(500).send(error);
    },
    (result) => res.setStatus(code).send(result),
  );
