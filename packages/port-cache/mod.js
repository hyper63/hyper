import { z } from "./deps.js";

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
  z.discriminatedUnion("ok", [
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
  ]);

/**
 * @param {function} adapter - implementation detail for this port
 * @param {object} env - environment settings for the adapter
 */
export function cache(adapter) {
  const cachePort = z.object({
    // list cache stores
    index: z.function()
      .args()
      .returns(
        // TODO: this needs to follow the hyper response format.
        z.promise(z.union([
          z.string().array(),
          hyperResSchema(z.object({
            caches: z.string().array(),
          })),
        ])),
      ),
    createStore: z.function()
      .args(z.string())
      .returns(
        z.promise(
          hyperResSchema(),
        ),
      ),
    destroyStore: z.function()
      .args(z.string())
      .returns(
        z.promise(
          hyperResSchema(),
        ),
      ),
    createDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string(),
        value: z.any(),
        ttl: z.string().optional(),
      }))
      .returns(
        z.promise(
          hyperResSchema(),
        ),
      ),
    getDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string(),
      }))
      .returns(
        z.promise(
          // TODO: this needs to follow the hyper response format.
          z.union([
            z.object({}).passthrough(),
            hyperResSchema(z.object({
              doc: z.object({}).passthrough(),
            })),
          ]),
        ),
      ),
    updateDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string(),
        value: z.any(),
        ttl: z.string().optional(),
      }))
      .returns(
        z.promise(
          hyperResSchema(),
        ),
      ),
    deleteDoc: z.function()
      .args(z.object({
        store: z.string(),
        key: z.string(),
      }))
      .returns(
        z.promise(
          hyperResSchema(),
        ),
      ),
    listDocs: z.function()
      .args(z.object({
        store: z.string(),
        pattern: z.string().optional(),
      }))
      .returns(
        z.promise(
          hyperResSchema(z.object({
            docs: z.array(
              z.any(), // TODO: should this be z.object({}).passthrough() ?
            ),
          })),
        ),
      ),
  });
  const instance = cachePort.parse(adapter);
  instance.createStore = cachePort.shape.createStore.validate(
    instance.createStore,
  );
  instance.destroyStore = cachePort.shape.destroyStore.validate(
    instance.destroyStore,
  );
  instance.createDoc = cachePort.shape.createDoc.validate(instance.createDoc);
  instance.getDoc = cachePort.shape.getDoc.validate(instance.getDoc);
  instance.updateDoc = cachePort.shape.updateDoc.validate(instance.updateDoc);
  instance.deleteDoc = cachePort.shape.deleteDoc.validate(instance.deleteDoc);
  instance.listDocs = cachePort.shape.listDocs.validate(instance.listDocs);

  return instance;
}
