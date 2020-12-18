
const { writeFileSync } = require('fs')
const { join } = require('path')

const { gql, GraphQLUpload, makeExecutableSchema } = require('apollo-server-express')
const { printSchema } = require('graphql')

const { schema } = require('../src/graphql')

// Have to add the Upload type, that is added implictly by Apollo, explicitly for schema export to work
schema.resolvers = {
  ...schema.resolvers,
  Upload: GraphQLUpload
}

schema.typeDefs = [
  ...schema.typeDefs,
  gql`
    scalar Upload
  `
]

const _schema = makeExecutableSchema(schema)

writeFileSync(join(__dirname, '..', 'schema.graphql'), printSchema(_schema))
