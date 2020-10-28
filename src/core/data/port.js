/**
 * This module contains the specification and validation rules for the
 * adapter. Every adapter must implement this port or interface specification.
 *
 * In order to validate the implementation, we will use zod
 *
 * Zod will validate the shape of the service adapter
 * Then it will wrap function validation wrapper on each
 * adapter method to validate the arguments and return
 * types at runtime.
 *
 * Data Adapter should have the following functions:
 * - createDatabase
 * - removeDatabase
 * - createDocument
 * - retrieveDocument
 * - updateDocument
 * - removeDocument
 */
const z = require("zod");

const Aync = z.object({
  map: z.function(),
  chain: z.function(),
  fork: z.function(),
});

const Port = z.object({
  // dbname => Async(Response)
  createDatabase: z.function().args(z.string()).returns(Async),
  // dbname => Async(Response)
  removeDatabase: z.function().args(z.string()).returns(Async),
  // db, id, doc => Async(Response)
  createDocument: z
    .function()
    .args(z.string(), z.string(), z.object())
    .returns(Async),
  retrieveDocument: z.function().args(z.string(), z.string()).returns(Async),
  updateDocument: z
    .function()
    .args(z.string(), z.string(), z.object())
    .returns(Async),
  removeDocument: z.function().args(z.string(), z.string()).returns(Async),
});

const validateCreateDb = z.function().args(z.string()).returns(Async);

module.exports = (service) => {
  // validate shape
  Port.parse(service);
  // for each function wrap a
  // function validator
  // return wrapped service
  service.createDatabase = Port.shape.createDatabase.validate(
    service.createDatabase
  );
  service.removeDatabase = Port.shape.removeDatabase.validate(
    service.removeDatabase
  );
  service.createDocument = Port.shape.createDocument.validate(
    service.createDocument
  );
  service.retrieveDocument = Port.shape.retrieveDocument.validate(
    service.retrieveDocument
  );
  service.updateDocument = Port.shape.updateDocument.validate(
    service.updateDocument
  );
  service.removeDocument = Port.shape.removeDocument.validate(
    service.removeDocument
  );
  return service;
};
