import { HyperRequest, Method } from "../types.ts";
import { R, signJWT } from "../deps.ts";

const { assoc } = R;

// deno-lint-ignore no-explicit-any
const generateToken = (sub: string, secret: any) => {
  const exp = Math.floor(Date.now() / 1000) + (60 * 5);
  return signJWT({ alg: "HS256", type: "JWT" }, { sub: sub, exp }, secret);
};

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
    const protocol = conn.protocol === "cloud:" ? "https:" : conn.protocol;

    let options = {
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      method: method ? method : Method.GET,
    } as RequestOptions;

    if (body) {
      // deno-lint-ignore no-explicit-any
      options = assoc("body", JSON.stringify(body), options) as any;
    }

    if (conn.username && conn.password) {
      const token = await generateToken(conn.username, conn.password);
      options.headers = new Headers({
        ...Object.fromEntries(options.headers.entries()),
        Authorization: `Bearer ${token}`,
      });
    }

    let url = `${protocol}//${conn.host}${conn.pathname}/${service}/${domain}`;

    if (resource) url += `/${resource}`;
    else if (action) url += `/${action}`;

    if (params) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    return { url, options };
  };
