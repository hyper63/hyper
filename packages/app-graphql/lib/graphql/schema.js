import { R } from '../../deps.js'

const { mergeDeepRight } = R

// Interfaces
import * as PortResult from './__interface/PortResult/port-result.schema.js'

// Generic Types
import * as Scalars from './scalars.js'
import * as RootInfo from './RootInfo/root-info.schema.js'
import * as PerPortInfo from './PerPortInfo/per-port-info.schema.js'
import * as PortInfo from './PortInfo/port-info.schema.js'

// Cache
import * as Cache from './Cache/cache.schema.js'
import * as CacheResult from './CacheResult/cache-result.schema.js'

// Data
import * as Data from './Data/data-schema.js'
import * as DataResult from './DataResult/data-result.schema.js'

// Storage
import * as Storage from './Storage/storage-schema.js'
import * as StorageResult from './StorageResult/storage-result-schema.js'

// Crawler
import * as Crawler from './Crawler/crawler.schema.js'
import * as CrawlerResult from './CrawlerResult/crawler-result.schema.js'

// Root Types
import * as Query from './Query/query.schema.js'
import * as Mutation from './Mutation/mutation.schema.js'

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
  Crawler,
  CrawlerResult,
  Query,
  Mutation,
].reduce((acc, { typeDefs, resolvers = {} }) => ({
  typeDefs: [...acc.typeDefs, typeDefs],
  resolvers: mergeDeepRight(acc.resolvers, resolvers),
}), { typeDefs: [], resolvers: {} })

export const typeDefs = schema.typeDefs
export const resolvers = schema.resolvers
