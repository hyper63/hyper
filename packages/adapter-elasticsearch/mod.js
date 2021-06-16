import { R } from "./deps.js";

import { asyncFetch, createHeaders, handleResponse } from "./async-fetch.js";
import adapter from "./adapter.js";

const { mergeDeepRight, defaultTo, pipe } = R;

export default function ElasticsearchAdapter(config) {
  return Object.freeze({
    id: "elasticsearch",
    port: "search",
    load: pipe(
      defaultTo({}),
      mergeDeepRight(config),
    ),
    link: (env) =>
      () => {
        if (!env.url) throw new Error("Config URL is required elastic search");
        const headers = createHeaders(config.username, config.password);
        // TODO: probably shouldn't use origin, so to support mounting elasticsearch on path
        return adapter({
          config: new URL(env.url),
          asyncFetch: asyncFetch(fetch),
          headers,
          handleResponse,
        });
      },
  });
}
