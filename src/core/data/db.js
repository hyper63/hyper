import { is, of, apply, triggerEvent } from '../utils'

const INVALID_DB_MSG = "database name is not valid";
const INVALID_RESPONSE = "response is not valid";

export const create = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply("createDatabase"))
    .chain(triggerEvent('DATA:CREATE_DB'))
    .chain(is(validResponse, INVALID_RESPONSE));

export const remove = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(triggerEvent('DATA:DELETE_DB'))
    .chain(apply("removeDatabase"));

function validDbName(name) {
  return true;
}

function validResponse(response) {
  return true;
}
