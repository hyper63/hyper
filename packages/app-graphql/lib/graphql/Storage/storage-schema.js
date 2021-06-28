import { Buffer, crocks, gql, R, urlJoin } from "../../../deps.js";

import {
  hyper63ServicesContextLens,
  requestContextLens,
} from "../../utils/hyper63-context.lens.js";

const { view } = R;
const { Async } = crocks;

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
    # Name is optional and defaults to filename
    putStorageObject (bucket: String!, prefix: String! name: String): StorageResult!
    removeStorageObject (bucket: String!, prefix: String!): StorageResult!
  }
`;

const resolvers = {
  Storage: {
    info: () => ({ port: "Storage" }),
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
          `${req.protocol}://${req.get("host")}`,
          "storage",
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
    putStorageObject: async (_, { bucket, prefix, name }, context) => {
      // Pull file off of opine request context for now
      const { file } = view(requestContextLens, context);
      const { storage } = view(hyper63ServicesContextLens, context);

      const reader = file.content
        ? new Buffer(file.content.buffer) // from memory
        : await Deno.open(file.tempfile, { read: true }); // from tempfile if too large for memory buffer

      /**
       * Ensure reader is closed to prevent leaks
       * in the case of a tempfile being created
       */
      const cleanup = (_constructor) =>
        Async.fromPromise(async (res) => {
          if (typeof reader.close === "function") {
            await reader.close();
          }

          return _constructor(res);
        });

      return storage.putObject(
        bucket,
        urlJoin(prefix, name || file.filename),
        reader,
      ).bichain(
        cleanup(Promise.reject.bind(Promise)),
        cleanup(Promise.resolve.bind(Promise)),
      ).toPromise();
    },
    removeStorageObject: (_, { bucket, prefix }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context);
      return storage.removeObject(bucket, prefix).toPromise();
    },
  },
};

export { resolvers, typeDefs };
