import { Action, HyperRequest, HyperRequestFunction, Method } from "../types";

const service = "cache" as const;

const includeTTL = (ttl: string | undefined) =>
  (o: HyperRequest) => ttl ? { ...o, params: { ttl } } : o;

export const add = (key: string, value: unknown, ttl?: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.POST, body: { key, value, ttl } });

export const get = (key: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.GET, resource: key });

export const remove = (key: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.DELETE, resource: key });

export const set = (key: string, value: unknown, ttl?: string) =>
  (h: HyperRequestFunction) =>
    h(
      [{ service, method: Method.PUT, resource: key, body: value }]
        .map(includeTTL(ttl))[0],
    );

// deno-lint-ignore no-inferrable-types
export const query = (pattern: string = "*") =>
  (h: HyperRequestFunction) =>
    h({
      service,
      method: Method.POST,
      action: Action.QUERY,
      params: { pattern },
    });
