import { SignJWT } from "jose";
import { assoc } from "ramda";
import { HyperRequest, Method } from "../types";
import { Headers } from "node-fetch";

// deno-lint-ignore no-explicit-any
const generateToken = async (sub: string, secret: any) => {
  const crypto = await import("crypto");
  const key = crypto.createSecretKey(secret);
  const token = await new SignJWT({ sub })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(key);
  return token;
};

interface RequestOptions {
  body?: unknown;
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
      headers: {
        "Content-Type": "application/json",
      },
      method: method ? method : "GET",
    };

    if (body) {
      options = assoc("body", JSON.stringify(body), options);
    }

    if (conn.username && conn.password) {
      const token = await generateToken(conn.username, conn.password);
      options.headers = assoc(
        "Authorization",
        `Bearer ${token}`,
        options.headers,
      );
    }

    let url = `${protocol}//${conn.host}${conn.pathname}/${service}/${domain}`;

    if (resource) url += `/${resource}`;
    else if (action) url += `/${action}`;

    if (params) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    return { url, options };
  };
