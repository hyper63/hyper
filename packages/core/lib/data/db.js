import { crocks, R } from "../../deps.js";

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
const { lensProp, over, evolve, map } = R;

const INVALID_DB_MSG = "database name is not valid";
const INVALID_RESPONSE = "response is not valid";

export const create = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply("createDatabase"))
    .chain(triggerEvent("DATA:CREATE_DB"))
    .chain(is(validResponse, INVALID_RESPONSE));

export const remove = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(triggerEvent("DATA:DELETE_DB"))
    .chain(apply("removeDatabase"));

export const query = (db, query) =>
  of({ db, query })
    .chain(apply("queryDocuments"))
    .chain(triggerEvent("DATA:QUERY"))
    .chain(liftFn((res) =>
      rejectHyperErr(res)
        .map((res) => {
          res.docs.forEach(monitorIdUsage("queryDocuments - result", db));
          return res;
        })
        .map(evolve({ docs: map(mapId) }))
        .bichain(
          handleHyperErr,
          Async.Resolved,
        )
    ));

export const index = (db, name, fields) =>
  of({ db, name, fields })
    .chain(apply("indexDocuments"))
    .chain(triggerEvent("DATA:INDEX"));

export const list = (db, options) =>
  of({ db, ...options })
    .map(over(lensProp("descending"), Boolean))
    .chain(apply("listDocuments"))
    .chain(triggerEvent("DATA:LIST"))
    .chain(liftFn((res) =>
      rejectHyperErr(res)
        .map((res) => {
          res.docs.forEach(monitorIdUsage("listDocuments - result", db));
          return res;
        })
        .map(evolve({ docs: map(mapId) }))
        .bichain(
          handleHyperErr,
          Async.Resolved,
        )
    ));

export const bulk = (db, docs) =>
  of({ db, docs })
    .map((args) => {
      args.docs.forEach(monitorIdUsage("bulkDocuments - args", db));
      return args;
    })
    .chain(apply("bulkDocuments"))
    .chain(triggerEvent("DATA:BULK"));

function validDbName() {
  return true;
}

function validResponse() {
  return true;
}
