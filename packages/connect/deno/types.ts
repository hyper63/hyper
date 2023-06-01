export type SortOptions = typeof SortOptions[keyof typeof SortOptions]
export const SortOptions = {
  DESC: 'DESC',
  ASC: 'ASC',
} as const

export type IndexFieldOptions = SortOptions
export const IndexFieldOptions = SortOptions

export type Method = typeof Method[keyof typeof Method]
export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const

export type Action = typeof Action[keyof typeof Action]
export const Action = {
  QUERY: '_query',
  BULK: '_bulk',
  INDEX: '_index',
} as const

export type QueueStatus = typeof QueueStatus[keyof typeof QueueStatus]
export const QueueStatus = {
  ERROR: 'ERROR',
  READY: 'READY',
} as const

export interface ListOptions {
  limit?: number
  startkey?: string
  endkey?: string
  keys?: string[]
  descending?: boolean
}

// deno-lint-ignore no-explicit-any
export type Obj = { [key: string]: any }
export interface OkResult {
  ok: true
}

export interface NotOkResult {
  ok: false
  msg?: string
  status?: number
}

export type Result = OkResult | NotOkResult
export type OkIdResult = OkResult & { id: string }
export type IdResult = OkIdResult | NotOkResult
export type OkUrlResult = OkResult & { url: string }

export interface StorageSignedUrlOptions {
  type: 'upload' | 'download'
}

export interface SearchQueryOptions {
  fields?: string[]
  filter?: Record<string, string>
}

export interface QueryOptions {
  fields?: string[]
  sort?: { [k: string]: SortOptions }[]
  limit?: number
  useIndex?: string
}

export type HyperGetDocResult<Type extends Obj = Obj> =
  | (OkResult & { doc: Type })
  | NotOkResult

export type HyperDocsResult<Type extends Obj = Obj> =
  | (OkResult & { docs: Type[] })
  | NotOkResult
export interface HyperData {
  add: <Type extends Obj = Obj>(doc: Type) => Promise<IdResult>
  get: <Type extends Obj = Obj>(id: string) => Promise<HyperGetDocResult<Type>>
  list: <Type extends Obj = Obj>(
    options?: ListOptions,
  ) => Promise<HyperDocsResult<Type>>
  update: <Type extends Obj = Obj>(id: string, doc: Type) => Promise<IdResult>
  remove: (id: string) => Promise<IdResult>
  query: <Type extends Obj = Obj>(
    selector: unknown,
    options?: QueryOptions,
  ) => Promise<HyperDocsResult<Type>>
  index: (name: string, fields: string[]) => Promise<Result>
  bulk: <Type extends Obj = Obj>(
    docs: Array<Type>,
  ) => Promise<HyperDocsResult<IdResult>>
  create: () => Promise<IdResult>
  destroy: (confirm: boolean) => Promise<Result>
}

export interface HyperCache {
  add: <Type extends Obj = Obj>(
    key: string,
    value: Type,
    ttl?: string,
  ) => Promise<Result>
  get: <Type extends Obj = Obj>(
    key: string,
  ) => Promise<HyperGetDocResult<Type>>
  remove: (key: string) => Promise<Result>
  set: <Type extends Obj = Obj>(
    key: string,
    value: Type,
    ttl?: string,
  ) => Promise<Result>
  query: <Type extends Obj = Obj>(
    pattern: string,
  ) => Promise<HyperDocsResult<Type>>
  create: () => Promise<Result>
  destroy: (confirm: boolean) => Promise<Result>
}

export type HyperSearchQueryResult<Type extends Obj = Obj> =
  | (OkResult & { matches: Type[] })
  | NotOkResult
export type HyperSearchLoadResult<Type extends Obj = Obj> =
  | (OkResult & { results: Type[] })
  | NotOkResult
export interface HyperSearch {
  add: <Type extends Obj = Obj>(key: string, doc: Type) => Promise<Result>
  remove: (key: string) => Promise<Result>
  get: <Type extends Obj = Obj>(
    key: string,
  ) => Promise<(OkResult & { key: string; doc: Type }) | NotOkResult>
  update: <Type extends Obj = Obj>(key: string, doc: Type) => Promise<Result>
  query: <Type extends Obj = Obj>(
    query: string,
    options?: SearchQueryOptions,
  ) => Promise<HyperSearchQueryResult<Type>>
  load: <Type extends Obj = Obj>(
    docs: Type[],
  ) => Promise<HyperSearchLoadResult<Type>>
  create: (
    fields: Array<string>,
    storeFields?: Array<string>,
  ) => Promise<Result>
  destroy: (confirm: boolean) => Promise<Result>
}

interface HyperInfoServicesResult {
  name: string
  version: string
  services: string[]
}

export interface HyperInfo {
  services: () => Promise<HyperInfoServicesResult>
}

export interface HyperStorage {
  upload: (name: string, data: Uint8Array) => Promise<Result>
  download: (name: string) => Promise<ReadableStream>
  signedUrl: (
    name: string,
    options: StorageSignedUrlOptions,
  ) => Promise<OkUrlResult | NotOkResult>
  remove: (name: string) => Promise<Result>
}

export interface HyperQueue {
  enqueue: <Job>(job: Job) => Promise<Result>
  errors: <Job>() => Promise<Job[]>
  queued: <Job>() => Promise<Job[]>
}

export interface HyperRequest {
  service: 'data' | 'cache' | 'storage' | 'search' | 'queue' | 'info'
  method: Method
  resource?: string
  headers?: Headers
  body?: unknown
  // deno-lint-ignore no-explicit-any
  params?: undefined | Record<string, any>
  action?: Action
}

export type HyperRequestFunction = (request: HyperRequest) => Promise<Request>
