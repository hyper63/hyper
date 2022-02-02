import { Request } from "node-fetch";

export type SortOptions = "DESC" | "ASC";
export const SortOptions = {
  DESC: "DESC" as SortOptions,
  ASC: "ASC" as SortOptions,
};

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export const Method = {
  GET: "GET" as Method,
  POST: "POST" as Method,
  PUT: "PUT" as Method,
  DELETE: "DELETE" as Method,
  PATCH: "PATCH" as Method,
};

export type Action = "_query" | "_bulk" | "_index";
export const Action = {
  QUERY: "_query" as Action,
  BULK: "_bulk" as Action,
  INDEX: "_index" as Action,
};

export interface ListOptions {
  limit?: number;
  startkey?: string;
  endkey?: string;
  keys?: string[];
  descending?: boolean;
}

export interface Result {
  ok: boolean;
  id?: string;
  msg?: string;
  status?: number;
}

export interface Results<Type> {
  ok: boolean;
  status?: number;
  docs: Type[];
}

export interface SearchQueryOptions {
  fields: string[];
  filter: Record<string, string>;
}

export interface QueryOptions {
  fields?: string[];
  sort?: { [k: string]: SortOptions }[];
  limit?: number;
  useIndex?: string;
}

export interface HyperData {
  add: <Type>(body: Type) => Promise<Result>;
  get: <Type>(id: string) => Promise<Type | Result>;
  list: <Type>(options?: ListOptions) => Promise<Results<Type>>;
  update: <Type>(id: string, doc: Type) => Promise<Result>;
  remove: (id: string) => Promise<Result>;
  query: <Type>(
    selector: unknown,
    options?: QueryOptions,
  ) => Promise<Results<Type>>;
  index: (name: string, fields: string[]) => Promise<Result>;
  bulk: <Type>(docs: Array<Type>) => Promise<Result>;
  create: () => Promise<Result>;
  destroy: (confirm: boolean) => Promise<Result>;
}

export interface HyperCache {
  add: <Type>(key: string, value: Type, ttl?: string) => Promise<Result>;
  get: <Type>(key: string) => Promise<Type>;
  remove: (key: string) => Promise<Result>;
  set: <Type>(key: string, value: Type, ttl?: string) => Promise<Result>;
  query: <Type>(pattern: string) => Promise<Results<Type>>;
  create: () => Promise<Result>;
  destroy: (confirm: boolean) => Promise<Result>;
}

export interface HyperSearch {
  add: <Type>(key: string, doc: Type) => Promise<Result>;
  remove: (key: string) => Promise<Result>;
  get: <Type>(key: string) => Promise<Type>;
  update: <Type>(key: string, doc: Type) => Promise<Result>;
  query: <Type>(
    query: string,
    options: SearchQueryOptions,
  ) => Promise<Results<Type>>;
  load: <Type>(docs: Type[]) => Promise<Result>;
  create: (
    fields: Array<string>,
    storeFields?: Array<string>,
  ) => Promise<Result>;
  destroy: (confirm: boolean) => Promise<Result>;
}

interface HyperInfoServicesResult {
  name: string;
  version: string;
  services: string[];
}

export interface HyperInfo {
  services: () => Promise<HyperInfoServicesResult>;
}

export interface HyperStorage {
  upload: (name: string, data: ReadableStream) => Promise<Result>;
  download: (name: string) => Promise<ReadableStream>;
}

export interface HyperQueue {
  enqueue: <Job>(job: Job) => Promise<Result>;
  errors: <Job>() => Promise<Job[]>;
  queued: <Job>() => Promise<Job[]>;
}

export interface Hyper {
  data: HyperData;
  cache: HyperCache;
  search: HyperSearch;
  storage: HyperStorage;
  queue: HyperQueue;
  info: HyperInfo;
}

export interface HyperRequest {
  service: "data" | "cache" | "storage" | "search" | "queue" | "info";
  method: Method;
  resource?: string;
  body?: unknown;
  // deno-lint-ignore no-explicit-any
  params?: undefined | Record<string, any>;
  action?: Action;
}

export type HyperRequestFunction = (request: HyperRequest) => Promise<Request>;
