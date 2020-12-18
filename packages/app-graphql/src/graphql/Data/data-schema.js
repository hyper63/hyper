
const { gql } = require('apollo-server-express')
const { view } = require('ramda')

const { hyper63ServicesContextLens } = require('../../utils/hyper63-context.lens')

const typeDefs = gql`
  """
  The Hyper63 Data Type
  """
  type Data {
    info: PortInfo!
    name: String!
    record (id: String!): DataResult!
    query (data: JSON!): DataResult!
  }

  extend type Mutation {
    createDatabase (db: String!): DataResult!
    destroyDatabase (db: String!): DataResult!
    createData (db: String!, data: JSON!): DataResult!
    updateData(db: String!, id: String!, data: JSON!): DataResult!
    deleteData (db: String!, id: String!): DataResult!
  }
`

const resolvers = {
  // TODO: check that database with this name exists
  Data: {
    info: () => ({ port: 'Data' }),
    name: async ({ name }) => name,
    record: async ({ name }, { id }, context) => {
      const { data } = view(hyper63ServicesContextLens, context)
      return data.getDocument(name, id).toPromise()
    },
    query: async ({ name }, { data }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context)
      return dataPort.query(name, data).toPromise()
    }
  },
  Mutation: {
    createDatabase: (_, { db }, context) => {
      const { data } = view(hyper63ServicesContextLens, context)
      return data.createDatabase(db).toPromise()
    },
    destroyDatabase: (_, { db }, context) => {
      const { data } = view(hyper63ServicesContextLens, context)
      return data.destroyDatabase(db).toPromise()
    },
    createData: (_, { db, data }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context)
      return dataPort.createDocument(db, data).toPromise()
    },
    updateData: (_, { db, id, data }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context)
      return dataPort.updateDocument(db, id, data).toPromise()
    },
    deleteData: (_, { db, id }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context)
      return dataPort.removeDocument(db, id).toPromise()
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
