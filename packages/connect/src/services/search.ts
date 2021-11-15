//import { Request } from "node-fetch";

import {
  Action,
  HyperRequestFunction,
  Method,
  SearchQueryOptions,
} from "../types";

import { lensPath, set } from "ramda";

const service = "search" as const;

export const add = (key: string, doc: unknown) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.POST, body: { key, doc } });

export const remove = (key: string) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.DELETE, resource: key });

export const get = (key: string) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.GET, resource: key });

export const update = (key: string, doc: unknown) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.PUT, resource: key, body: doc });

export const query = (query: string, options?: SearchQueryOptions) =>
  (hyper: HyperRequestFunction) =>
    hyper(
      [{ service, method: Method.POST, action: Action.QUERY, body: { query } }]
        .map((r) =>
          options && options.fields
            ? set(lensPath(["body", "fields"]), options.fields, r)
            : r
        )
        .map((r) =>
          options && options.filter
            ? set(lensPath(["body", "filter"]), options.filter, r)
            : r
        )[0],
    );

export const load = (docs: unknown[]) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.POST, action: Action.BULK, body: docs });

export const create = (fields: string[], storeFields?: string[]) =>
  (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.PUT, body: { fields, storeFields } });

export const destroy = (confirm = true) =>
  (hyper: HyperRequestFunction) =>
    confirm
      ? hyper({ service, method: Method.DELETE })
      : Promise.reject({ ok: false, msg: "request not confirmed!" });
