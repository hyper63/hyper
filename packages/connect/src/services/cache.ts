import { HyperRequestFunction } from "../types";

const service = "cache";

export const add = (key: string, value: unknown, ttl?: string) =>
  (h: HyperRequestFunction) =>
    h({ service, method: "POST", body: { key, value, ttl } });
