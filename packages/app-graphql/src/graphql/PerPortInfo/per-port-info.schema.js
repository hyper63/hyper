
const { gql } = require('apollo-server-express')

const typeDefs = gql`
  """
  Describes PortInfo metadata per port
  """
  type PerPortInfo {
    cache: PortInfo!
    storage: PortInfo!
    data: PortInfo!
    hooks: PortInfo!
  }
`

const resolvers = {
  PerPortInfo: {
    cache: () => ({ port: 'Cache' }),
    storage: () => ({ port: 'Storage' }),
    data: () => ({ port: 'Data' }),
    hooks: () => ({ port: 'Hooks' })
  }
}

module.exports = {
  typeDefs,
  resolvers
}
