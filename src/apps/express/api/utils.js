export const fork = (res, code, m) =>
  m.fork(
    (error) => res.status(500).send(error),
    (result) => res.status(code).send(result)
  );
