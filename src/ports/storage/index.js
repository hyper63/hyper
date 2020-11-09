import * as z from 'zod'

/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
export default function (adapter) {
  const Port = z.object({ 
    makeBucket: z.function(),
    removeBucket: z.function(),
    listBuckets: z.function(),
    putObject: z.function(),
    removeObject: z.function(),
    getObject: z.function(),
    listObjects: z.function()
 })
 const instance = Port.parse(adapter)
 instance.makeBucket = Port.shape.makeBucket.validate(instance.makeBucket)
 instance.removeBucket = Port.shape.removeBucket.validate(instance.removeBucket)
 instance.listBuckets = Port.shape.listBuckets.validate(instance.listBuckets)
 instance.putObject = Port.shape.putObject.validate(instance.putObject)
 instance.removeObject = Port.shape.removeObject.validate(instance.removeObject)
 instance.listObjects = Port.shape.listObjects.validate(instance.listObjects)
  

 return instance
}