import * as z from 'zod'

export default function (adapter, env) {
  const Port = z.object({
    // add port methods
    createIndex: z.function()
      .args(z.object({
        index: z.string(),
        mappings: z.any()
      }))
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
    indexDoc: z.function()
      .args(z.object({
        index: z.string(),
        key: z.string(), // remember to invalidate if key === query 
        doc: z.any()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional()
      }))),
    updateDoc: z.function()
      .args(z.object({
        index: z.string(),
        doc: z.any()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional()
      }))),
    getDoc: z.function()
      .args(z.object({
        index: z.string(),
        key: z.string()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        doc: z.any()
      }))),
    removeDoc: z.function()
      .args(z.object({
        index: z.string(),
        key: z.string()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        msg: z.string().optional()
      }))),
    query: z.function()
      .args(z.object({
        index: z.string(),
        q: z.any()
      }))
      .returns(z.promise(z.object({
        ok: z.boolean(),
        matches: z.array(z.any())
      })))
  })

  const instance = Port.parse(adapter)
  instance.createIndex = Port.shape.createIndex.validate(instance.createIndex)
  instance.deleteIndex = Port.shape.deleteIndex.validate(instance.deleteIndex)
  instance.indexDoc = Port.shape.indexDoc.validate(instance.indexDoc)
  instance.getDoc = Port.shape.getDoc.validate(instance.getDoc)
  instance.updateDoc = Port.shape.updateDoc.validate(instance.updateDoc)
  instance.removeDoc = Port.shape.removeDoc.validate(instance.removeDoc)

  instance.query = Port.shape.query.validate(instance.query)

  return instance
}