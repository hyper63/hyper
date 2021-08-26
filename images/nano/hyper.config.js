import { app, dndb, fs, memory, minisearch } from "./deps.js";

export default {
  app,
  adapters: [
    {
      port: "data",
      plugins: [dndb({ dir: "/tmp" })],
    },
    {
      port: "cache",
      plugins: [memory()],
    },
    {
      port: "storage",
      plugins: [fs({ dir: "/tmp" })],
    },
    {
      port: "search",
      plugins: [minisearch()],
    },
  ],
};
