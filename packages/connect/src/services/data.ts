import { Action, HyperRequestFunction, Method } from "../types";

const service = "data";

export interface ListOptions {
  limit?: number;
  startkey?: string;
  endkey?: string;
  keys?: string[];
  descending?: boolean;
}

enum SortOptions {
  DESC = "DESC",
  ASC = "ASC",
}

export interface QueryOptions {
  fields?: string[];
  sort?: { [k: string]: SortOptions }[];
  limit?: number;
  useIndex?: string;
}

export const add = (body: unknown) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.POST, body });
export const get = (id: string) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.GET, resource: id });
export const list = (options: ListOptions = {}) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.GET, params: options });
export const update = (id: string, doc: unknown) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.PUT, resource: id, body: doc });
export const remove = (id: string) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.DELETE, resource: id });
export const query = (selector: unknown, options?: QueryOptions) =>
  (hyper: HyperRequestFunction) =>
    hyper({
      service,
      method: Method.POST,
      action: Action.QUERY,
      body: { selector, ...options },
    });
export const bulk = (docs: unknown[]) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.POST, action: Action.BULK, body: docs });
export const index = (indexName: string, fields: string[]) =>
  (hyper: HyperRequestFunction) =>
    hyper({
      service,
      method: Method.POST,
      action: Action.INDEX,
      body: {
        fields,
        name: indexName,
        type: "JSON",
      },
    });
