const jwt = require('express-jwt')
module.exports = (app) => {
  app.use(jwt({
    secret: process.env.SECRET,
    algorithms: ['HS256']
  }))
  return app
}
