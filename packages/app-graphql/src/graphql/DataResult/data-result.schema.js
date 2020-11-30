
const { gql } = require('apollo-server-express')
const { always, compose, identity, ifElse, is, omit, prop } = require('ramda')

const typeDefs = gql`
  """
  Represents the result of a data port operation
  """
  type DataResult implements PortResult {
    ok: Boolean!
    msg: String
    type: String!
    data: JSON
  }
`

const resolvers = {
  DataResult: {
    type: () => 'data',
    msg: ({ msg }) => msg,
    ok: compose(
      ifElse(
        is(Boolean),
        identity,
        always(true) // default to ok: true if not in parent
      ),
      prop('ok')
    ),
    // Parent is the data
    data: omit(['ok'])
  }
}

module.exports = {
  typeDefs,
  resolvers
}
