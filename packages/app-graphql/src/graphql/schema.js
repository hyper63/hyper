
const { mergeDeepRight} = require('ramda')

// Interfaces
const PortResult = require('./__interface/PortResult')

// Generic Types
const Scalars = require('./scalars')
const RootInfo = require('./RootInfo')
const PerPortInfo = require('./PerPortInfo')
const PortInfo = require('./PortInfo')

// Cache
const Cache = require('./Cache')
const CacheResult = require('./CacheResult')

// Data
const Data = require('./Data')
const DataResult = require('./DataResult')

// Storage
const Storage = require('./Storage')
const StorageResult = require('./StorageResult')

// Root Types
const Query = require('./Query')
const Mutation = require('./Mutation')

const schema = [
  PortResult,
  Scalars,
  RootInfo,
  PerPortInfo,
  PortInfo,
  Cache,
  CacheResult,
  Data,
  DataResult,
  Storage,
  StorageResult,
  Query,
  Mutation
].reduce((acc, { typeDefs, resolvers = {} }) => ({
  typeDefs: [...acc.typeDefs, typeDefs],
  resolvers: mergeDeepRight(acc.resolvers, resolvers)
}), { typeDefs: [], resolvers: {} })

module.exports = {
  schema
}
