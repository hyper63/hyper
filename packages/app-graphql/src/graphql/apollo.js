
const { join } = require('path')

const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const mime = require('mime')
const cors = require('cors')
const { reduce, set } = require('ramda')

const { hyper63ServicesContextLens } = require('../utils/hyper63-context.lens')
const { STORAGE_PATH } = require('../constants')

function addServicesContexter (services) {
  return (_, prevContext) => set(
    hyper63ServicesContextLens,
    services,
    prevContext
  )
}

function addExpressContext ({ req, res }, prevContext) {
  return {
    ...prevContext,
    req,
    res
  }
}

function getObject (storage) {
  return ({ params }, res) => {
    storage.getObject(params.name, params[0]).fork(
      (e) => res.status(500).send({ ok: false, msg: e.message }),
      (s) => {
        // get mime type
        const mimeType = mime.getType(params[0].split('.')[1])
        res.writeHead(200, {
          'Content-Type': mimeType,
          'Transfer-Encoding': 'chunked'
        })
        s.pipe(res)
      }
    )
  }
}

const mountApollo = ({
  schema: { typeDefs, resolvers },
  contexters = [],
  app = express()
    .use(cors({ credentials: true }))
}) => services => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: expressContext => reduce(
      async (prevContext, contexter) => contexter(expressContext, await prevContext),
      {},
      [...contexters, addExpressContext, addServicesContexter(services)]
    )
  })

  server.applyMiddleware({ app, path: '/graphql' })

  app.get('/', (req, res) => res.send({ name: 'hyper63' }))

  // For serving files
  app.get(join(STORAGE_PATH, ':name', '*'), getObject(services.storage))

  return app
}

module.exports = {
  mountApollo
}
