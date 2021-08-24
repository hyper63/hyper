import {
  app,
  dndb,
  fs,
  hooks as _hooks,
  memory,
  minisearch,
  queue,
} from "./deps.js";

import { forward } from "./middleware/forward.js";
import { serviceIndex } from "./middleware/service-index.js";
import { HYPER_DELIMITER } from "./constants.js";

export const config = {
  app,
  adapters: [
    { port: "cache", plugins: [memory()] },
    { port: "data", plugins: [dndb({ dir: "/tmp" })] },
    { port: "storage", plugins: [fs({ dir: "/tmp" })] },
    { port: "search", plugins: [minisearch()] },
    { port: "queue", plugins: [queue('/tmp/queue.db')] },
  ],
  middleware: [
    forward(HYPER_DELIMITER),
    //serviceIndex(),
  ],
};
