import { R } from "./deps.js";

import adapter from "./adapter.js";

const { identity } = R;

/**
 * hyper63 memory plugin adapter
 *
 * This memory plugin for the cache root is an adapter
 * that just uses a JS Map to store documents in memory.
 */
export default function memory() {
  return ({
    id: "memory",
    port: "cache",
    load: identity,
    link: () => () => adapter(),
  });
}
