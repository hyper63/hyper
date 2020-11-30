
const { gql } = require('apollo-server-express')

/**
 * Mutations are recommended to always be top lvl, while queries
 * are structured more like a graph and do not necessarily
 * need to be at the top lvl. Ergo mutations are defined in their
 * respective type domain folders
 */

const typeDefs = gql`
  type Mutation
`

const resolvers = {}

module.exports = {
  typeDefs,
  resolvers
}
