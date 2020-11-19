import { is, of, apply, triggerEvent } from '../utils'
import cuid from 'cuid'

const INVALID_ID_MSG = "doc id is not valid";
const INVALID_RESPONSE = "response is not valid";

const createGUID = (id) => (id ? id : cuid());

export const create = (db, doc) =>
  of({ db, id: createGUID(doc.id), doc })
    .chain(apply("createDocument"))
    .chain(triggerEvent('DATA:CREATE'))
    .chain(is(validResponse, INVALID_RESPONSE));

export const get = (db, id) => 
  of({ db, id })
    .chain(apply("retrieveDocument"))
    .chain(triggerEvent('DATA:GET'));

export const update = (db, id, doc) =>
  of({ db, id, doc })
    .chain(apply("updateDocument"))
    .chain(triggerEvent('DATA:UPDATE'));

export const remove = (db, id) => 
  of({ db, id })
    .chain(apply("removeDocument"))
    .chain(triggerEvent('DATA:DELETE'));

function validDbName(name) {
  return true;
}

function validResponse(response) {
  return true;
}
