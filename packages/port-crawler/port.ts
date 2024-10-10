import { z, type ZodRawShape } from 'zod'

/**
 * The hyper response schema. MOST adapter methods return this shape.
 * The ones that do not will be refactored to do so in upcoming major releases
 *
 * There are two distinct types, a "success" and "error" type, each identifiable
 * by the ok field, false and true, respectively.
 *
 * This distinction off a discriminating field is precisely the use case for Zod's Discriminated Union.
 * Otherwise, all fields would be optional, which isn't much of a schema.
 *
 * @argument {z.ZodSchema} schema - the schema for the success response, it is extended to ensure
 * ok: true is always parsed
 */
const hyperResponse = <T extends ZodRawShape>(schema: T) =>
  z.discriminatedUnion('ok', [
    // ok: true
    z
      .object({
        ...schema,
        ok: z.literal(true),
        msg: z.string().optional(),
        status: z.number().optional(),
      })
      /**
       * Allow other keys to passthrough until we
       * decide on which additional fields to return across apis ie.
       * id vs 'nothing'. Let adapter impls experiment
       * and see what feels right
       */
      .passthrough(),
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
const GetResponse = z.union([CrawlerDoc, hyperResponse({ doc: CrawlerDoc })])

export const port = z.object({
  get: z
    .function()
    .args(
      z.object({
        app: z.string(),
        name: z.string(),
      }),
    )
    .returns(z.promise(GetResponse)),
  upsert: z
    .function()
    .args(CrawlerDoc)
    .returns(z.promise(hyperResponse({}))),
  start: z
    .function()
    .args(
      z.object({
        app: z.string(),
        name: z.string(),
      }),
    )
    .returns(z.promise(hyperResponse({}))),
  delete: z
    .function()
    .args(
      z.object({
        app: z.string(),
        name: z.string(),
      }),
    )
    .returns(z.promise(hyperResponse({}))),
})

export type CrawlerPort = z.infer<typeof port>
