import { toDataQuery } from "../utils/hyper-query.ts";

import {
  Action,
  HyperRequestFunction,
  ListOptions,
  Method,
  QueryOptions,
} from "../types.ts";
import { HYPER_LEGACY_GET_HEADER } from "../utils/hyper-request.ts";

const service = "data" as const;

export const add = (body: unknown) => (hyper: HyperRequestFunction) =>
  hyper({ service, method: Method.POST, body });
export const get = (id: string) => (hyper: HyperRequestFunction) => {
  return hyper({
    service,
    method: Method.GET,
    headers: new Headers({
      /**
       * Once the legacy flag is removed hyper,
       * this will effectively do nothing
       *
       * TODO: remove when legacy flag is removed from hyper
       */
      [HYPER_LEGACY_GET_HEADER]: "false",
    }),
    resource: id,
  });
};
export const list =
  (options: ListOptions = {}) => (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.GET, params: options });
export const update =
  (id: string, doc: unknown) => (hyper: HyperRequestFunction) =>
    hyper({ service, method: Method.PUT, resource: id, body: doc });
export const remove = (id: string) => (hyper: HyperRequestFunction) =>
  hyper({ service, method: Method.DELETE, resource: id });
export const query =
  (selector: unknown, options?: QueryOptions) =>
  (hyper: HyperRequestFunction) =>
    hyper({
      service,
      method: Method.POST,
      action: Action.QUERY,
      body: toDataQuery(selector, options),
    });
export const bulk = (docs: unknown[]) => (hyper: HyperRequestFunction) =>
  hyper({ service, method: Method.POST, action: Action.BULK, body: docs });
export const index =
  (indexName: string, fields: string[]) => (hyper: HyperRequestFunction) =>
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

export const create = () => (hyper: HyperRequestFunction) =>
  hyper({ service, method: Method.PUT });

export const destroy = (confirm = true) => (hyper: HyperRequestFunction) =>
  confirm
    ? hyper({ service, method: Method.DELETE })
    : Promise.reject({ ok: false, msg: "request not confirmed!" });
