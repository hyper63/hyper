import { Request } from 'node-fetch'

import { HyperRequestFunction, Method } from "../types";

const service = "info" as const;

export const services = () =>
  (h: HyperRequestFunction) => h({ service, method: Method.GET });
