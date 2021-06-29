import { gql, R } from "../../../deps.js";
const { view } = R;

import { hyper63ServicesContextLens } from "../../utils/hyper63-context.lens.js";

const typeDefs = gql`
  """
  The hyper Cache Service Type
  """
  type Cache {
    info: PortInfo!
    name: String!
    doc (key: String!): CacheResult!
    docs (pattern: String!): CacheResult!
  }

  extend type Mutation {
    createCacheStore (cache: String!): CacheResult!
    deleteCacheStore (cache: String!): CacheResult!
    createCacheDocument (cache: String!, key: String!, value: JSON!, ttl: String!): CacheResult!
    updateCacheDocument (cache: String!, key: String!, value: JSON!, ttl: String!): CacheResult!
    deleteCacheDocument (cache: String!, key: String!): CacheResult!
  }
`;

const resolvers = {
  // TODO: check that cache with this name exists
  Cache: {
    info: () => ({ port: "Cache" }),
    name: ({ name }) => {
      return name;
    },
    doc: ({ name }, { key }, context) => {
      const { cache } = view(hyper63ServicesContextLens, context);
      return cache.getDoc(name, key).toPromise();
    },
    docs: ({ name }, { pattern }, context) => {
      const { cache } = view(hyper63ServicesContextLens, context);
      return cache.queryStore(name, pattern).toPromise();
    },
  },
  Mutation: {
    createCacheStore: (_, { cache }, context) => {
      const { cache: cachePort } = view(hyper63ServicesContextLens, context);
      return cachePort.createStore(cache).toPromise();
    },
    deleteCacheStore: (_, { cache }, context) => {
      const { cache: cachePort } = view(hyper63ServicesContextLens, context);
      return cachePort.deleteStore(cache).toPromise();
    },
    createCacheDocument: (_, { cache, key, value, ttl }, context) => {
      const { cache: cachePort } = view(hyper63ServicesContextLens, context);
      return cachePort.createDoc(cache, key, value, ttl).toPromise();
    },
    updateCacheDocument: (_, { cache, key, value, ttl }, context) => {
      const { cache: cachePort } = view(hyper63ServicesContextLens, context);
      return cachePort.updateDoc(cache, key, value, ttl).toPromise();
    },
    deleteCacheDocument: (_, { cache, key }, context) => {
      const { cache: cachePort } = view(hyper63ServicesContextLens, context);
      return cachePort.deleteDoc(cache, key).toPromise();
    },
  },
};

export { resolvers, typeDefs };
