const { is, of, apply } = require("../utils");
const INVALID_ID_MSG = "doc id is not valid";
const INVALID_RESPONSE = "response is not valid";

const create = (db, id, doc) =>
  of({ db, id, doc })
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
