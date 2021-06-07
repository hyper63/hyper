const z = require('zod')
/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
module.exports = function (adapter) {
  const cachePort = z.object({
    // list cache stores
    index: z.function()
      .args()
      .returns(
        z.promise(z.string().array())
      ),
    createStore: z.function()
      .args(z.string())
      .returns(
        z.promise(
          z.object({
            ok: z.boolean()
          })
        )
      ),
    destroyStore: z.function()
      .args(z.string())
      .returns(
        z.promise(
          z.object({
            ok: z.boolean()
          })
        )
      ),
    createDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string(),
        value: z.any(),
        ttl: z.string().optional()
      }))
      .returns(
        z.promise(
          z.object({
            ok: z.boolean(),
            error: z.string().optional()
          })
        )
      ),
    getDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string()
      }))
      .returns(
        z.promise(
          z.union([
            z.object({ ok: z.boolean(), status: z.number().optional(), msg: z.string() }),
            z.object({}).passthrough()
          ])
        )
      ),
    updateDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string(),
        value: z.any(),
        ttl: z.string().optional()
      }))
      .returns(
        z.promise(
          z.object({
            ok: z.boolean(),
            error: z.string().optional()
          })
        )
      ),
    deleteDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string()
      }))
      .returns(
        z.promise(
          z.object({
            ok: z.boolean(),
            error: z.string().optional()
          })
        )
      ),
    listDocs: z.function()
      .args(z.object({
        store: z.string(),
        pattern: z.string().optional()
      }))
      .returns(
        z.promise(
          z.object({
            ok: z.boolean(),
            docs: z.array(
              z.any()
            )
          })
        )
      )
  })
  const instance = cachePort.parse(adapter)
  instance.createStore = cachePort.shape.createStore.validate(instance.createStore)
  instance.destroyStore = cachePort.shape.destroyStore.validate(instance.destroyStore)
  instance.createDoc = cachePort.shape.createDoc.validate(instance.createDoc)
  instance.getDoc = cachePort.shape.getDoc.validate(instance.getDoc)
  instance.updateDoc = cachePort.shape.updateDoc.validate(instance.updateDoc)
  instance.deleteDoc = cachePort.shape.deleteDoc.validate(instance.deleteDoc)
  instance.listDocs = cachePort.shape.listDocs.validate(instance.listDocs)

  return instance
}
