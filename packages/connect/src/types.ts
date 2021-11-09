export interface HyperRequest {
  service: Service;
  method: Method;
  resource?: string;
  body?: unknown;
  params?: unknown;
  action?: Action;
}

export type HyperRequestFunction = (request: HyperRequest) => Request;
