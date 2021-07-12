import { z } from "./deps.js";

const CrawlerDoc = z.object({
  id: z.string().optional(), // unique identifier {app}-{name}
  app: z.string(),
  name: z.string(), // unique name of job
  source: z.string().url(), // url to crawl
  depth: z.number(), // number of levels to traverse
  script: z.string(), // script to apply on each page crawled to get output (title, content)
  target: z.object({
    url: z.string().url(),
    secret: z.string(),
    sub: z.string().optional(),
    aud: z.string().optional(),
  }), // storage endpoint to store generated content
  notify: z.string().url(), // url to notify when job is complete
});

const Port = z.object({
  get: z.function()
    .args(z.object({
      app: z.string(),
      name: z.string(),
    }))
    .returns(z.promise(CrawlerDoc)),
  upsert: z.function()
    .args(CrawlerDoc)
    .returns(z.promise(z.object({
      ok: z.boolean(),
    }))),
  start: z.function()
    .args(z.object({
      app: z.string(),
      name: z.string(),
    }))
    .returns(z.promise(z.object({ ok: z.boolean() }))),
  "delete": z.function()
    .args(z.object({
      app: z.string(),
      name: z.string(),
    }))
    .returns(z.promise(z.object({ ok: z.boolean() }))),
});

export function crawler(adapter) {
  const instance = Port.parse(adapter);
  instance.upsert = Port.shape.upsert.validate(instance.upsert);
  instance.get = Port.shape.get.validate(instance.get);
  instance.start = Port.shape.start.validate(instance.start);
  instance.delete = Port.shape.delete.validate(instance.delete);

  return instance;
}
