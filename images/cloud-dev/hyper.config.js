import {
  dndb,
  fs,
  hooks as _hooks,
  memory,
  minisearch,
  queue,
  app
} from "./deps.js";

import { forward } from './middleware/forward.js'
import { serviceIndex } from './middleware/service-index.js'


const DELIMITER = 'hyper-63'

export const config = {
  app,
  adapters: [
    { port: "cache", plugins: [memory()] },
    { port: "data", plugins: [dndb({ dir: '/tmp' })] },
    { port: "storage", plugins: [fs({ dir: '/tmp' })] },
    { port: "search", plugins: [minisearch()] },
    { port: "queue", plugins: [queue()] },
  ],
  middleware: [
    forward(DELIMITER),
    serviceIndex(DELIMITER)
  ]
};