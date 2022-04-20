import { Colors, hyper } from "./deps.js";
import { create as createHyperDir, DIR } from "./dir.js";
import * as Log from "./log.js";

import config from "./hyper.config.js";

const rgb = (code) => (text) => Colors.rgb24(text, code);

const style = {
  storage: ["🗃", rgb(0x1286F6)],
  cache: ["⭐️", rgb(0xBA46DF)],
  data: ["💿", rgb(0x2AB52E)],
  search: ["🔎", rgb(0xFE7621)],
  queue: ["🗂", rgb(0xFC4059)],
};

export async function create({ domain, type, body = {} }) {
  const port = Deno.env.get("PORT") || 6363;

  return await fetch(`http://localhost:${port}/${type}/${domain}`, {
    method: "PUT",
    body: JSON.stringify(body),
  }).then(async (res) =>
    res.ok || res.status === 409
      ? Promise.resolve(await res.json())
      : Promise.reject(await res.json())
  );
}

export async function destroy({ domain, type }) {
  const port = Deno.env.get("PORT") || 6363;

  return await fetch(`http://localhost:${port}/${type}/${domain}`, {
    method: "DELETE",
  }).then(async (res) =>
    res.ok || res.status === 404 // cast not found to success
      ? Promise.resolve(await res.json())
      : Promise.reject(await res.json())
  );
}

/**
 * Start the hyper nano instance listening on port 6363 or PORT env variable,
 * and optionally bootstrap services. By default, no bootstrapping is done.
 * you can then consume your hyper instance using HTTP or `hyper-connect` (recommended)
 *
 * pass `http://localhost:[port]/[domain] to `hyper-connect` as your connection string
 *
 * @typedef {Object} Services
 * @property {boolean} data
 * @property {boolean} cache
 * @property {boolean} storage
 *
 * @typedef {Object} MainArgs
 * @property {string} [domain] - the name of the domain. defaults to `'test'`
 * @property {boolean} [experimental] - must be `true` if using experimental features. defaults to `false`
 * @property {Services} [purge] - which services to purge prior to creation. defaults to {} which is a noop
 * @property {Services} [services] - which services to create. defaults to {} which is a noop
 *
 * @param {MainArgs} [args] - defaults to {}
 * @returns {Promise<app>} - the opine app listening of port 6363 or PORT env variable
 */
export async function main(args = {}) {
  const {
    domain = "test",
    purge = {},
    services = {},
    experimental = false,
    middleware = [],
  } = args;

  Log.info(`storing hyper service data in ${DIR} 🗃`);
  await createHyperDir();

  Log.info(`starting hyper nano ⚡️`);
  const app = await hyper({ ...config, middleware }).then((app) =>
    new Promise((resolve) => setTimeout(() => resolve(app), 1000))
  );

  const doExperimental = [
    ...Object.values(purge),
    ...Object.values(services),
  ].reduce((acc, cur) => acc || cur, false);

  if (doExperimental) {
    if (!experimental) {
      Log.error("the --experimental flag must be set");
      return Deno.exit(1);
    }

    Log.warn(
      `Using experimental features. These features can change at any time.`,
    );

    await Promise.all(
      Object.keys(services).map(async (type) => {
        // maybe purge
        if (purge[type]) {
          await destroy({ domain, type });
          Log.info(
            `Purged ${style[type][1](type)} ${style[type][0]} service in ${
              Colors.green(domain)
            } domain ❌`,
          );
        }

        if (services[type]) {
          await create({ domain, type });
          Log.info(
            `Created ${style[type][1](type)} ${style[type][0]} service in ${
              Colors.green(domain)
            } domain ⚡️`,
          );
        }
      }),
    );
  }

  return app;
}
