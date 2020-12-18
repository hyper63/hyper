
const { join } = require('path')
const { gql } = require('apollo-server-express')
const { path, view } = require('ramda')

const { hyper63ServicesContextLens } = require('../../utils/hyper63-context.lens')
const { STORAGE_PATH } = require('../../constants')

const typeDefs = gql`
  """
  The Hyper63 Storage Type
  """
  type Storage {
    info: PortInfo!
    name: String!
    # GraphQL does not serve files. We only provide metadata for file here
    #  We use express to serve up the actual file
    object (prefix: String!, name: String!): StorageResult!
    objects (prefix: String!): StorageResult!
  }

  extend type Mutation {
    makeStorageBucket (bucket: String!): StorageResult!
    removeStorageBucket (bucket: String!): StorageResult!
    # Name is optional and defaults to filename
    putStorageObject (bucket: String!, prefix: String!, file: Upload!, name: String): StorageResult!
    removeStorageObject (bucket: String!, prefix: String!): StorageResult!
  }
`

const resolvers = {
  Storage: {
    info: () => ({ port: 'Storage' }),
    name: async ({ name }) => name,
    /**
     * GraphQL does not serve files. We only provide metadata for file here
     * We use express to serve up the actual file
     */
    object: async ({ name }, { prefix, name: objectName }, { req }) => {
      // ? TODO: should we check to see if file exists?
      return {
        ok: true,
        // Provide url to download in GraphQL response
        url: join(`${req.protocol}://${req.get('host')}`, STORAGE_PATH, name, prefix, objectName)
      }
    },
    objects: async ({ name }, { prefix }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context)
      return storage.listObjects(name, prefix).toPromise()
    }
  },
  Mutation: {
    makeStorageBucket: (_, { bucket }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context)
      return storage.makeBucket(bucket).toPromise()
    },
    removeStorageBucket: (_, { bucket }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context)
      return storage.removeBucket(bucket).toPromise()
    },
    putStorageObject: async (_, { bucket, prefix, file, name }, context) => {
      file = await file
      const { storage } = view(hyper63ServicesContextLens, context)

      return storage.putObject(
        bucket,
        join(prefix, name || file.filename),
        // https://github.com/jaydenseric/graphql-upload#type-fileupload
        file.createReadStream()
      ).toPromise()
    },
    removeStorageObject: (_, { bucket, prefix }, context) => {
      const { storage } = view(hyper63ServicesContextLens, context)
      return storage.removeObject(bucket, prefix).toPromise()
    }
  }
}

module.exports = {
  typeDefs,
  resolvers
}
