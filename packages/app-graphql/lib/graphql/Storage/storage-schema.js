import { gql, R, urlJoin } from '../../../deps.js';

import { STORAGE_PATH } from '../../constants.js';
import { hyper63ServicesContextLens } from '../../utils/hyper63-context.lens.js';

const { view } = R;

const typeDefs = gql`
  """
  The hyper Storage Service Type
  """
  type Storage {
    info: PortInfo!
    name: String!
    # GraphQL does not serve files. We only provide metadata for file here
    # We use opine to serve up the actual file
    object (prefix: String!, name: String!): StorageResult!
    objects (prefix: String!): StorageResult!
  }

  extend type Mutation {
    makeStorageBucket (bucket: String!): StorageResult!
    removeStorageBucket (bucket: String!): StorageResult!
    removeStorageObject (bucket: String!, prefix: String!, name: String!): StorageResult!
  }
`;

const resolvers = {
  Storage: {
    info: () => ({ port: 'Storage' }),
    name: ({ name }) => name,
    /**
     * GraphQL does not serve files. We only provide metadata for file here
     * We use opine to serve up the actual file
     */
    object: ({ name }, { prefix, name: objectName }, { req }) => {
      // ? TODO: should we check to see if file exists?
      return {
        ok: true,
        // Provide url to download in GraphQL response
        url: urlJoin(
          `${req.protocol}://${req.get('host')}`,
          STORAGE_PATH,
          name,
          prefix,
          objectName,
        ),
      };
    },
    objects: ({ name }, { prefix }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context);
      return storage.listObjects(name, prefix).toPromise();
    },
  },
  Mutation: {
    makeStorageBucket: (_, { bucket }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context);
      return storage.makeBucket(bucket).toPromise();
    },
    removeStorageBucket: (_, { bucket }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context);
      return storage.removeBucket(bucket).toPromise();
    },
    removeStorageObject: (_, { bucket, prefix, name: objectName }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context);
      return storage.removeObject(bucket, urlJoin(prefix, objectName))
        .toPromise();
    },
  },
};

export { resolvers, typeDefs };
