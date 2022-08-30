import { HyperRequestFunction, Method } from "../types.ts";

const service = "info" as const;

export const services = () => (h: HyperRequestFunction) =>
  h({ service, method: Method.GET });
