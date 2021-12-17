import { cuid, R } from "../../deps.js";
import {
  apply,
  is,
  mapId,
  monitorIdUsage,
  of,
  triggerEvent,
} from "../utils/mod.js";

const { compose, assoc, ifElse, isNil, isEmpty, omit, always } = R;

// const INVALID_ID_MSG = 'doc id is not valid'
const INVALID_RESPONSE = "response is not valid";

// If no document, just passthrough
const setIds = ifElse(
  (doc) => isNil(doc) || isEmpty(doc),
  always({}),
  compose(
    (doc) => assoc("id", doc.id || doc._id)(doc), // _id is guaranteed to be set
    (doc) => assoc("_id", doc._id || doc.id || cuid())(doc),
  ),
);

export const create = (db, doc) =>
  of(doc)
    .map(monitorIdUsage("createDocument - args", db))
    .map(setIds)
    .map((doc) => ({ db, id: doc._id || cuid(), doc }))
    .chain(apply("createDocument"))
    .chain(triggerEvent("DATA:CREATE"))
    .map(mapId)
    .map(omit(["_id"])) // only id is on the api
    .chain(is(validResponse, INVALID_RESPONSE));

export const get = (db, id) =>
  of({ db, id })
    .chain(apply("retrieveDocument"))
    .chain(triggerEvent("DATA:GET"))
    .map(monitorIdUsage("retrieveDocument - result", db))
    .map(mapId);

export const update = (db, id, doc) =>
  of({ db, id, doc })
    .map((args) => {
      monitorIdUsage("updateDocument - args", args.db)(args.doc);
      return args;
    })
    .chain(apply("updateDocument"))
    .chain(triggerEvent("DATA:UPDATE"))
    .map(mapId)
    .map(omit(["_id"])); // only id is on the api

export const remove = (db, id) =>
  of({ db, id })
    .chain(apply("removeDocument"))
    .chain(triggerEvent("DATA:DELETE"))
    .map(mapId)
    .map(omit(["_id"])); // only id is on the api

function validResponse() {
  return true;
}
