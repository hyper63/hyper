import { HyperRequest, Method } from "../types.ts";
import { generateToken, R } from "../deps.deno.ts";

const { assoc } = R;

interface RequestOptions {
  body?: BodyInit;
  headers: Headers;
  method: Method;
}

interface HyperRequestParams {
  url: string;
  options?: RequestOptions;
}

export const hyper = (conn: URL, domain: string) =>
  async (
    { service, method, resource, body, params, action }: HyperRequest,
  ): Promise<HyperRequestParams> => {
    const isCloud = /^cloud/.test(conn.protocol);
    const protocol = isCloud ? "https:" : conn.protocol;

    let options = {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      method: method ? method : Method.GET,
    } as RequestOptions;

    if (body) {
      options = assoc("body", JSON.stringify(body), options) as RequestOptions;
    }

    if (conn.username && conn.password) {
      const token = await generateToken(conn.username, conn.password);
      options.headers = new Headers({
        ...Object.fromEntries(options.headers.entries()),
        Authorization: `Bearer ${token}`,
      });
    }
    const pathname = isCloud ? conn.pathname : "";
    const appdomain = isCloud ? "/" + domain : conn.pathname;

    let url = `${protocol}//${conn.host}${pathname}/${service}${appdomain}`;

    if (service === "info") {
      url = `${protocol}//${conn.host}`;
    }

    if (resource) url += `/${resource}`;
    else if (action) url += `/${action}`;

    if (params) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    return { url, options };
  };
