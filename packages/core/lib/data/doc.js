import { cuid, R } from "../../deps.js";
import { apply, is, of, triggerEvent } from "../utils/mod.js";

const { defaultTo } = R;

// const INVALID_ID_MSG = 'doc id is not valid'
const INVALID_RESPONSE = "response is not valid";

export const create = (db, doc) =>
  of(doc)
    .map(defaultTo({}))
    .map((doc) => ({ db, id: doc._id || cuid(), doc }))
    .chain(apply("createDocument"))
    .chain(triggerEvent("DATA:CREATE"))
    .chain(is(validResponse, INVALID_RESPONSE));

export const get = (db, id) =>
  of({ db, id })
    .chain(apply("retrieveDocument"))
    .chain(triggerEvent("DATA:GET"));

export const update = (db, id, doc) =>
  of({ db, id, doc })
    .chain(apply("updateDocument"))
    .chain(triggerEvent("DATA:UPDATE"));

export const remove = (db, id) =>
  of({ db, id })
    .chain(apply("removeDocument"))
    .chain(triggerEvent("DATA:DELETE"));

function validResponse() {
  return true;
}
