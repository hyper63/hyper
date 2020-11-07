import { is, of, apply } from '../utils'
import cuid from 'cuid'

const INVALID_ID_MSG = "doc id is not valid";
const INVALID_RESPONSE = "response is not valid";

const createGUID = (id) => (id ? id : cuid());

export const create = (db, doc) =>
  of({ db, id: createGUID(doc.id), doc })
    .chain(apply("createDocument"))
    .chain(is(validResponse, INVALID_RESPONSE));

export const get = (db, id) => of({ db, id }).chain(apply("retrieveDocument"));
export const update = (db, id, doc) =>
  of({ db, id, doc }).chain(apply("updateDocument"));
export const remove = (db, id) => of({ db, id }).chain(apply("removeDocument"));

function validDbName(name) {
  return true;
}

function validResponse(response) {
  return true;
}
