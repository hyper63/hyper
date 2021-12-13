import { cuid } from "../../deps.js";
import { apply, is, mapId, of, triggerEvent } from "../utils/mod.js";

// const INVALID_ID_MSG = 'doc id is not valid'
const INVALID_RESPONSE = "response is not valid";

const createGUID = (doc) => (doc._id || doc.id || cuid());

export const create = (db, doc) =>
  of({ db, id: createGUID(doc), doc })
    .chain(apply("createDocument"))
    .chain(triggerEvent("DATA:CREATE"))
    .map(mapId)
    .chain(is(validResponse, INVALID_RESPONSE));

export const get = (db, id) =>
  of({ db, id })
    .chain(apply("retrieveDocument"))
    .chain(triggerEvent("DATA:GET"))
    .map(mapId);

export const update = (db, id, doc) =>
  of({ db, id, doc })
    .chain(apply("updateDocument"))
    .chain(triggerEvent("DATA:UPDATE"))
    .map(mapId);

export const remove = (db, id) =>
  of({ db, id })
    .chain(apply("removeDocument"))
    .chain(triggerEvent("DATA:DELETE"))
    .map(mapId);

function validResponse() {
  return true;
}
