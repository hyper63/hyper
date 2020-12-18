
const { mountApollo, schema } = require('./graphql')

// TODO: Maybe allow passing custom schema here?
module.exports = function () {
  return function (services, app) {
    app = mountApollo({ schema, app })(services)

    const port = parseInt(process.env.PORT) || 6363

    // Start server
    app.listen(port)
    console.log('hyper63 graphql service listening on port ', port)
  }
}
