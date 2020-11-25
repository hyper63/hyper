
const { gql } = require('apollo-server-express')

const typeDefs = gql`
  """
  Represents the result of a cache port operation
  """
  type CacheResult implements PortResult {
    ok: Boolean!
    msg: String
    type: String!
    data: JSON
  }
`

const resolvers = {
  CacheResult: {
    type: () => 'cache',
    msg: ({ msg }) => msg,
    ok: ({ ok }) => Boolean(ok),
    // Map both doc and docs to data in schema
    data: async ({ doc, docs }) => doc || docs
  }
}

module.exports = {
  typeDefs,
  resolvers
}
