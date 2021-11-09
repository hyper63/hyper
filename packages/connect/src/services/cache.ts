import { HyperRequest, HyperRequestFunction } from "../types";

const service = "cache";

const includeTTL = (ttl: string) =>
  (o: HyperRequest) => ttl ? { ...o, params: { ttl } } : o;

export const add = (key: string, value: unknown, ttl?: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: "POST", body: { key, value, ttl } });

export const get = (key: string) =>
  (h: HyperRequestFunction) => h({ service, method: "GET", resource: key });

export const remove = (key: string) =>
  (h: HyperRequestFunction) => h({ service, method: "DELETE", resource: key });

export const set = (key: string, value: unknown, ttl?: string) =>
  (h: HyperRequestFunction) =>
    h(
      [{ service, method: "PUT", resource: key, body: value }]
        .map(includeTTL(ttl))[0],
    );

// deno-lint-ignore no-inferrable-types
export const query = (pattern: string = "*") =>
  (h: HyperRequestFunction) =>
    h({ service, method: "POST", action: "_query", params: { pattern } });
