import express from "@hyper63/app-express";
import couchdb from "@hyper63/adapter-couchdb";
import redis from "@hyper63/adapter-redis";
import minio from "@hyper63/adapter-minio";
import es from "@hyper63/adapter-elasticsearch";
import bq from "@hyper63/adapter-beequeue";

export default {
  app: express,
  adapters: [
    {
      port: "data",
      plugins: [couchdb({ url: "http://admin:password@0.0.0.0:5984" })],
    },
    { port: "cache", plugins: [redis({ url: "redis://0.0.0.0:6379" })] },
    {
      port: "storage",
      plugins: [minio({ url: "http://admin:password@0.0.0.0:9000" })],
    },
    { port: "search", plugins: [es({ url: "http://0.0.0.0:9200" })] },
    { port: "queue", plugins: [bq.default({ redis: "redis://0.0.0.0:6379" })] },
  ],
};
