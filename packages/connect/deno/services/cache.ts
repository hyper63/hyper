import {
  Action,
  HyperRequest,
  HyperRequestFunction,
  Method,
} from "../types.ts";
import { HYPER_LEGACY_GET_HEADER } from "../utils/hyper-request.ts";

const service = "cache" as const;

const includeTTL = (ttl: string | undefined) => (o: HyperRequest) =>
  ttl ? { ...o, params: { ttl } } : o;

export const add =
  (key: string, value: unknown, ttl?: string) => (h: HyperRequestFunction) =>
    h({ service, method: Method.POST, body: { key, value, ttl } });

export const get = (key: string) => (h: HyperRequestFunction) => {
  return h({
    service,
    method: Method.GET,
    headers: new Headers({
      [HYPER_LEGACY_GET_HEADER]: "true",
    }),
    resource: key,
  });
};

export const remove = (key: string) => (h: HyperRequestFunction) =>
  h({ service, method: Method.DELETE, resource: key });

export const set =
  (key: string, value: unknown, ttl?: string) => (h: HyperRequestFunction) =>
    h(
      [{ service, method: Method.PUT, resource: key, body: value }].map(
        includeTTL(ttl),
      )[0],
    );

export const query = (pattern = "*") => (h: HyperRequestFunction) =>
  h({
    service,
    method: Method.POST,
    action: Action.QUERY,
    params: { pattern },
  });

export const create = () => (hyper: HyperRequestFunction) =>
  hyper({ service, method: Method.PUT });

export const destroy = (confirm = true) => (hyper: HyperRequestFunction) =>
  confirm
    ? hyper({ service, method: Method.DELETE })
    : Promise.reject({ ok: false, msg: "request not confirmed!" });
