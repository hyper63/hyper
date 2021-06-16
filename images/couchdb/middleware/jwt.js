const jwt = require("express-jwt");
module.exports = (app) => {
  // only secure data endpoint
  app.use(
    "/data",
    jwt({
      secret: process.env.SECRET,
      algorithms: ["HS256"],
    }),
  );
  return app;
};
