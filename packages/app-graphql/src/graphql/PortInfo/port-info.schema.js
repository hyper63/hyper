
const { gql } = require('apollo-server-express')

const typeDefs = gql`
  """
  Describes various metadata about a particular port
  """
  type PortInfo {
    name: String!
    version: String!
    status: String!
  }
`

const resolvers = {
  PortInfo: {
    name: async ({ port = '' }) => `hyper63 ${port}`.trim(),
    version: async () => '1.0', // ? where should this come from
    status: async () => 'unstable' // ? where should this come from
  }
}

module.exports = {
  typeDefs,
  resolvers
}
