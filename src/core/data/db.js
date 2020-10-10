const { is, of, apply } = require("../utils");
const INVALID_DB_MSG = "database name is not valid";
const INVALID_RESPONSE = "response is not valid";

const create = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply("createDatabase"))
    .chain(is(validResponse, INVALID_RESPONSE));

const remove = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply("removeDatabase"));

module.exports = {
  create,
  remove,
};

function validDbName(name) {
  return true;
}

function validResponse(response) {
  return true;
}
