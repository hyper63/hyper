import { ListOptions, QueryOptions } from "./services/data";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

enum Action {
  QUERY = "_query",
  BULK = "_bulk",
  INDEX = "_index",
}

enum Service {
  DATA = "data",
  CACHE = "cache",
}

export interface Result {
  ok: boolean;
  id?: string;
  msg?: string;
}

export interface Results<Type> {
  ok: boolean;
  docs: Type[];
}

export interface HyperData {
  add: <Type>(body: Type) => Promise<Result>;
  get: <Type>(id: string) => Promise<Type | Result>;
  list: <T>(options?: ListOptions) => Promise<Results<T>>;
  update: <Type>(id: string, doc: Type) => Promise<Result>;
  remove: (id: string) => Promise<Result>;
  query: <T>(selector: unknown, options?: QueryOptions) => Promise<Results<T>>;
  index: (name: string, fields: string[]) => Promise<Result>;
  bulk: <Type>(docs: Array<Type>) => Promise<Result>;
}

export interface HyperCache {
  add: <Type>(key: string, value: Type, ttl?: string) => Promise<Result>;
  get: <Type>(key: string) => Promise<Type>;
  remove: (key: string) => Promise<Result>;
  set: <Type>(key: string, value: Type, ttl?: string) => Promise<Result>;
  query: <Type>(pattern: string) => Promise<Results<Type>>;
}

export interface Hyper {
  data: HyperData;
  cache: HyperCache;
}

export interface HyperRequest {
  service: Service;
  method: Method;
  resource?: string;
  body?: unknown;
  params?: unknown;
  action?: Action;
}

export type HyperRequestFunction = (request: HyperRequest) => Request;
