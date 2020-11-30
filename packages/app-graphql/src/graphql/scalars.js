
const { gql } = require('apollo-server-express')
const { GraphQLJSON, GraphQLJSONObject } = require('graphql-type-json')

const typeDefs = gql`
  scalar JSON
  scalar JSONObject
`

const resolvers = {
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject
}

module.exports = {
  typeDefs,
  resolvers
}
