// app
const express = require("@hyper63/app-express");

// adapters
const memory = require("@hyper63/adapter-memory");
const pouchdb = require("@hyper63/adapter-pouchdb");
const fs = require("@hyper63/adapter-fs");
const minisearch = require("@hyper63/adapter-minisearch");
const hooks = require("@hyper63/adapter-hooks");
const q = require("@hyper63/adapter-zmq");

module.exports = {
  app: express,
  adapters: [
    { port: "cache", plugins: [memory()] },
    { port: "data", plugins: [pouchdb({ dir: process.env.DATA })] },
    { port: "storage", plugins: [fs({ dir: process.env.DATA })] },
    { port: "search", plugins: [minisearch()] },
    { port: "queue", plugins: [q("7373")] },
    {
      port: "hooks",
      plugins: [
        hooks([{
          matcher: "*",
          target: "http://127.0.0.1:9200/log/_doc",
        }]),
      ],
    },
  ],
  logs: {
    level: "INFO", // ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL
  },
};
