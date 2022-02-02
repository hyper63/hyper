import { HyperRequestFunction, Method } from "../types";

const service = "queue" as const;

export const enqueue = (body: unknown) =>
  (h: HyperRequestFunction) => h({ service, method: Method.POST, body });

export const errors = () =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.GET, params: { status: "ERROR" } });

export const queued = () =>
  (h: HyperRequestFunction) =>
    h({ service, method: Method.GET, params: { status: "READY" } });
