const { is, of, apply } = require("../utils");
const cuid = require("cuid");
const INVALID_ID_MSG = "doc id is not valid";
const INVALID_RESPONSE = "response is not valid";

const createGUID = (id) => (id ? id : cuid());

const create = (db, doc) =>
  of({ db, id: createGUID(doc.id), doc })
    .chain(apply("createDocument"))
    .chain(is(validResponse, INVALID_RESPONSE));

const get = (db, id) => of({ db, id }).chain(apply("retrieveDocument"));
const update = (db, id, doc) =>
  of({ db, id, doc }).chain(apply("updateDocument"));
const remove = (db, id) => of({ db, id }).chain(apply("removeDocument"));

module.exports = {
  create,
  get,
  update,
  remove,
};

function validDbName(name) {
  return true;
}

function validResponse(response) {
  return true;
}
