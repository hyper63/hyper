import { R } from '../../deps.js';

import { apply, is, of, triggerEvent } from '../utils/mod.js';

const { lensProp, over } = R;

const INVALID_DB_MSG = 'database name is not valid';
const INVALID_RESPONSE = 'response is not valid';

export const create = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply('createDatabase'))
    .chain(triggerEvent('DATA:CREATE_DB'))
    .chain(is(validResponse, INVALID_RESPONSE));

export const remove = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(triggerEvent('DATA:DELETE_DB'))
    .chain(apply('removeDatabase'));

export const query = (db, query) =>
  of({ db, query })
    .chain(apply('queryDocuments'))
    .chain(triggerEvent('DATA:QUERY'));

export const index = (db, name, fields) =>
  of({ db, name, fields })
    .chain(apply('indexDocuments'))
    .chain(triggerEvent('DATA:INDEX'));

export const list = (db, options) =>
  of({ db, ...options })
    .map(over(lensProp('descending'), Boolean))
    .chain(apply('listDocuments'))
    .chain(triggerEvent('DATA:LIST'));

export const bulk = (db, docs) =>
  of({ db, docs })
    .chain(apply('bulkDocuments'))
    .chain(triggerEvent('DATA:BULK'));

function validDbName() {
  return true;
}

function validResponse() {
  return true;
}
