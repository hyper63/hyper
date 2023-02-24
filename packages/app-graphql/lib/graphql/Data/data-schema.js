import { gql, R } from '../../../deps.js';
const { view } = R;

import { hyper63ServicesContextLens } from '../../utils/hyper63-context.lens.js';

const typeDefs = gql`
  """
  The hyper Data Service Type
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
`;

const resolvers = {
  // TODO: check that database with this name exists
  Data: {
    info: () => ({ port: 'Data' }),
    name: ({ name }) => name,
    record: ({ name }, { id }, context) => {
      const { data } = view(hyper63ServicesContextLens, context);
      return data.getDocument(name, id).toPromise();
    },
    query: ({ name }, { data }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context);
      return dataPort.query(name, data).toPromise();
    },
  },
  Mutation: {
    createDatabase: (_, { db }, context) => {
      const { data } = view(hyper63ServicesContextLens, context);
      return data.createDatabase(db).toPromise();
    },
    destroyDatabase: (_, { db }, context) => {
      const { data } = view(hyper63ServicesContextLens, context);
      return data.destroyDatabase(db).toPromise();
    },
    createData: (_, { db, data }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context);
      return dataPort.createDocument(db, data).toPromise();
    },
    updateData: (_, { db, id, data }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context);
      return dataPort.updateDocument(db, id, data).toPromise();
    },
    deleteData: (_, { db, id }, context) => {
      const { data: dataPort } = view(hyper63ServicesContextLens, context);
      return dataPort.removeDocument(db, id).toPromise();
    },
  },
};

export { resolvers, typeDefs };
