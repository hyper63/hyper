import { SignJWT } from "jose";

const generateToken = async (sub, secret) => {
  const crypto = await import("crypto");
  const key = crypto.createSecretKey(secret);
  const token = await new SignJWT({ sub })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(key);
  return token;
};

/**
 * @typedef {Object} hyperRequest
 * @property {string} service - [data, cache, search, storage, queue]
 * @property {string} method - [GET, POST, PUT, DELETE]
 * @property {string} [resource] - identifier
 * @property {Object} [body] - JSON Request body
 * @property {Object} [params] - query parameters
 * @property {string} [action] - [_query, _bulk, etc]
 */
/**
 * @param {URL} conn
 */
export const hyper = (conn, domain) =>
  /**
   * @param {hyperRequest}
   */
  async ({ service, method, resource, body, params, action }) => {
    const protocol = conn.protocol === "cloud:" ? "https:" : conn.protocol;

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
      method: method ? method : "GET",
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    if (conn.username && conn.password) {
      const token = await generateToken(conn.username, conn.password);
      options.headers.Authorization = `Bearer ${token}`;
    }

    let url = `${protocol}//${conn.host}${conn.pathname}/${service}/${domain}`;

    if (resource) url += `/${resource}`;
    else if (action) url += `/${action}`;

    if (params) {
      url += `?${new URLSearchParams(params).toString()}`;
    }

    return { url, options };
  };
