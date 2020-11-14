import * as z from 'zod'

export default function (adapter, env) {
  const Port = z.object({
    // add port methods
    createIndex: z.function()
      .args(z.string())
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional()
      }))),
    deleteIndex: z.function()
      .args(z.string())
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional()
      }))),
    index: z.function()
      .args(z.object({
        index: z.string(),
        doc: z.any()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional()
      }))),
    search: z.function()
      .args(z.object({
        index: z.string(),
        query: z.any()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        matches: z.array(z.any())
      })))
  })

  const instance = Port.parse(adapter(env))
  instance.createIndex = Port.shape.createIndex.validate(instance.createIndex)
  instance.deleteIndex = Port.shape.deleteIndex.validate(instance.deleteIndex)
  instance.index = Port.shape.index.validate(instance.index)
  instance.search = Port.shape.index.validate(instance.search)

  return instance
}