const z = require('zod')
/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
module.exports = function (adapter) {
  const cachePort = z.object({ 
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
      value: z.object(),
      ttl: z.string().optional()
    }))
    .returns(
      z.promise(
        z.object({
          ok: z.boolean(),
          error: z.string().optional()
        })
      )
    )
    ,
  getDoc: z.function() 
    .args(z.object({
      store: z.string(),
      key: z.string()
    }))
    .returns(
      z.promise(
        z.object({
          ok: z.boolean(),
          doc: z.any().optional(),
          msg: z.string().optional()
        })
      )
    ),
  updateDoc: z.function()
    .args(z.object({
      store: z.string(),
      key: z.string(),
      value: z.object(),
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
  let instance = cachePort.parse(adapter)
  instance.createStore = cachePort.shape.createStore.validate(instance.createStore)
  instance.destroyStore = cachePort.shape.destroyStore.validate(instance.destroyStore)
  instance.createDoc = cachePort.shape.createDoc.validate(instance.createDoc)
  instance.getDoc = cachePort.shape.getDoc.validate(instance.getDoc)
  instance.updateDoc = cachePort.shape.updateDoc.validate(instance.updateDoc)
  instance.deleteDoc = cachePort.shape.deleteDoc.validate(instance.deleteDoc)
  instance.listDocs = cachePort.shape.listDocs.validate(instance.listDocs)

  return instance
}