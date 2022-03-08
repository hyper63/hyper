import { crocks, cuid, R } from "../../deps.js";
import {
  apply,
  handleHyperErr,
  is,
  liftFn,
  mapId,
  monitorIdUsage,
  of,
  rejectHyperErr,
  triggerEvent,
} from "../utils/mod.js";

const { Async } = crocks;
const { omit, defaultTo } = R;

// const INVALID_ID_MSG = 'doc id is not valid'
const INVALID_RESPONSE = "response is not valid";

export const create = (db, doc) =>
  of(doc)
    .map(monitorIdUsage("createDocument - args", db))
    .map(defaultTo({}))
    .map((doc) => ({ db, id: doc._id || cuid(), doc }))
    .chain(apply("createDocument"))
    .chain(triggerEvent("DATA:CREATE"))
    .chain(is(validResponse, INVALID_RESPONSE));

export const get = (db, id) =>
  of({ db, id })
    .chain(apply("retrieveDocument"))
    .chain(triggerEvent("DATA:GET"))
    .chain(liftFn((res) =>
      rejectHyperErr(res)
        .map(monitorIdUsage("retrieveDocument - result", db))
        .map(mapId)
        .bichain(
          handleHyperErr,
          Async.Resolved,
        )
    ));

export const update = (db, id, doc) =>
  of({ db, id, doc })
    .map((args) => {
      monitorIdUsage("updateDocument - args", args.db)(args.doc);
      return args;
    })
    .chain(apply("updateDocument"))
    .chain(triggerEvent("DATA:UPDATE"))
    .chain(liftFn((res) =>
      rejectHyperErr(res)
        // TODO: id not enforced on port. Should it be?
        // For now, just mapping to id to match docs
        .map(mapId)
        .map(omit(["_id"]))
        .bichain(
          handleHyperErr,
          Async.Resolved,
        )
    ));

export const remove = (db, id) =>
  of({ db, id })
    .chain(apply("removeDocument"))
    .chain(triggerEvent("DATA:DELETE"));

function validResponse() {
  return true;
}
