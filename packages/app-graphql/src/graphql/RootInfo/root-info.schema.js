
const { gql } = require('apollo-server-express')

const typeDefs = gql`
  """
  Describes metadata about the Hyper63 Server
  """
  type RootInfo {
    name: String!
    ports: PerPortInfo!
  }
`

const resolvers = {
  RootInfo: {
    name: () => 'Hyper63',
    ports: () => ({})
  }
}

module.exports = {
  typeDefs,
  resolvers
}
