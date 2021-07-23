import { gql } from "../../../deps.js";

const typeDefs = gql`
  type Query {
    info: RootInfo
    cache (cache: String!): Cache
    data (db: String!): Data
    storage (bucket: String!): Storage
    crawler (bucket: String!): Crawler
  }
`;

const resolvers = {
  Query: {
    info: () => ({}),
    // TODO: check for existence of resource before sending along to children
    cache: (_, { cache }) => ({ name: cache }),
    data: (_, { db }) => ({ name: db }),
    storage: (_, { bucket }) => {
      // Singular bucket
      return { name: bucket };

      // const { storage } = view(hyper63ServicesContextLens, context)
      // // Multiple buckets [{ name: 'foo' }]
      // return storage.listBuckets().then(prop('buckets'))
    },
    crawler: (_, { bucket }) => ({ name: bucket })
  },
};

export { resolvers, typeDefs };
