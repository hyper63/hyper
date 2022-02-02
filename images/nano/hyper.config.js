import { app, cache, dndb, fs, minisearch, queue } from "./deps.js";

const DIR = "/tmp";

export default {
  app,
  adapters: [
    {
      port: "data",
      plugins: [dndb({ dir: DIR })],
    },
    {
      port: "cache",
      plugins: [cache({ dir: DIR })],
    },
    {
      port: "storage",
      plugins: [fs({ dir: DIR })],
    },
    {
      port: "search",
      plugins: [minisearch({ dir: DIR })],
    },
    {
      port: 'queue',
      plugins: [queue(DIR + '/hyper-queue.db')]
    }
  ],
};
