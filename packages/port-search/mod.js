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

export function search(adapter) {
  const Port = z.object({
    // add port methods
    createIndex: z.function()
      .args(z.object({
        index: z.string(),
        mappings: z.any(),
      }))
      .returns(z.promise(hyperResSchema())),
    deleteIndex: z.function()
      .args(z.string())
      .returns(z.promise(hyperResSchema())),
    indexDoc: z.function()
      .args(z.object({
        index: z.string(),
        key: z.string(), // remember to invalidate if key === query
        doc: z.any(),
      }))
      .returns(z.promise(hyperResSchema())),
    updateDoc: z.function()
      .args(z.object({
        index: z.string(),
        key: z.string(),
        doc: z.any(),
      }))
      .returns(z.promise(hyperResSchema())),
    getDoc: z.function()
      .args(z.object({
        index: z.string(),
        key: z.string(),
      }))
      .returns(z.promise(
        hyperResSchema(
          z.object({
            key: z.string(),
            doc: z.any(),
          }),
        ),
      )),
    removeDoc: z.function()
      .args(z.object({
        index: z.string(),
        key: z.string(),
      }))
      .returns(z.promise(hyperResSchema())),

    bulk: z.function()
      .args(z.object({
        index: z.string(),
        docs: z.array(
          z.any(),
        ),
      }))
      .returns(
        z.promise(
          hyperResSchema(
            z.object({
              results: z.array(z.any()),
            }),
          ),
        ),
      ),
    query: z.function()
      .args(z.object({
        index: z.string(),
        q: z.object({
          query: z.string(),
          fields: z.array(z.string()).optional(),
          filter: z.any().optional(),
        }),
      }))
      .returns(z.promise(
        hyperResSchema(
          z.object({
            matches: z.array(z.any()),
          }),
        ),
      )),
  });

  const instance = Port.parse(adapter);

  instance.createIndex = Port.shape.createIndex.validate(instance.createIndex);
  instance.deleteIndex = Port.shape.deleteIndex.validate(instance.deleteIndex);
  instance.indexDoc = Port.shape.indexDoc.validate(instance.indexDoc);
  instance.getDoc = Port.shape.getDoc.validate(instance.getDoc);
  instance.updateDoc = Port.shape.updateDoc.validate(instance.updateDoc);
  instance.removeDoc = Port.shape.removeDoc.validate(instance.removeDoc);

  instance.query = Port.shape.query.validate(instance.query);

  return instance;
}
