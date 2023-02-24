import { gql } from '../../../deps.js'

const typeDefs = gql`
  """
  Describes metadata about the hyper service
  """
  type RootInfo {
    name: String!
    ports: PerPortInfo!
  }
`

const resolvers = {
  RootInfo: {
    name: () => 'hyper',
    ports: () => ({}),
  },
}

export { resolvers, typeDefs }
