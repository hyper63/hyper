
const { gql } = require('apollo-server-express')

const typeDefs = gql`
  interface PortResult {
    ok: Boolean!
    msg: String
    type: String!
  }
`

const resolvers = {
  PortResult: {
    __resolveType: (portResult) => {
      switch (portResult) {
        case 'cache':
          return 'CacheResult'
        case 'data':
          return 'DataResult'
        case 'storage':
          return 'StorageResult'
        default:
          return 'UnknownResult'
      }
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
