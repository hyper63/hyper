import { z } from './deps.js'

/**
 * The hyper response schema. MOST adapter methods return this shape.
 * The ones that do not will be refactored to do so in upcoming major releases
 *
 * basically, there are two distinct types, each identifiable
 * by the ok field. This is precisely the use case for Zod's discriminated Union
 * Otherwise, all fields would be optional which isn't much of a schema
 *
 * @argument {z.ZodSchema} - the schema for the success response, it is extended to ensure
 * ok: true is always parsed
 */
const hyperResSchema = (schema = z.object({ ok: z.boolean() })) =>
  z.discriminatedUnion('ok', [
    // ok: true
    schema.extend({
      ok: z.literal(true),
      // TODO: These two fields ought not come back for ok: true responses
      // but are kept for backwards compatibility.
      msg: z.string().optional(),
      status: z.number().optional(),
    }),
    // ok: false aka. HyperErr
    z.object({
      ok: z.literal(false),
      msg: z.string().optional(),
      status: z.number().optional(),
    }),
  ])

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
})

// TODO: this needs to follow the hyper response format.
const GetResponse = z.union([
  CrawlerDoc,
  hyperResSchema(z.object({
    doc: CrawlerDoc,
  })),
])

const Port = z.object({
  get: z.function()
    .args(z.object({
      app: z.string(),
      name: z.string(),
    }))
    .returns(z.promise(GetResponse)),
  upsert: z.function()
    .args(CrawlerDoc)
    .returns(z.promise(hyperResSchema())),
  start: z.function()
    .args(z.object({
      app: z.string(),
      name: z.string(),
    }))
    .returns(
      z.promise(hyperResSchema()),
    ),
  'delete': z.function()
    .args(z.object({
      app: z.string(),
      name: z.string(),
    }))
    .returns(
      z.promise(
        hyperResSchema(),
      ),
    ),
})

export function crawler(adapter) {
  const instance = Port.parse(adapter)
  instance.upsert = Port.shape.upsert.validate(instance.upsert)
  instance.get = Port.shape.get.validate(instance.get)
  instance.start = Port.shape.start.validate(instance.start)
  instance.delete = Port.shape.delete.validate(instance.delete)

  return instance
}
