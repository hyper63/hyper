const { is, of, apply } = require("../utils");
const INVALID_NAME = "name is not valid";
const INVALID_RESULT = "result is not valid";

module.exports = {
  create: (name) =>
    of(name)
      .chain(is(validName, INVALID_NAME))
      .chain(apply("createStore"))
      .chain(is(validResult, INVALID_RESULT)),
  delete: (name) =>
    of(name)
      .chain(is(validName, INVALID_NAME))
      .chain(apply("destroyStore"))
      .chain(is(validResult, INVALID_RESULT)),
  query: (name, pattern) =>
    of(name)
      .chain(is(validName, INVALID_NAME))
      .map((name) => ({ store: name, pattern }))
      .chain(apply("listDocs"))
      .chain(is(validResult, INVALID_RESULT)),
};

// validators predicate functions

function validName(name) {
  // verify that the name does not contains spaces
  // verify that the name does not contain slashes
  // verify that the name contains URI friendly characters
  // should return a Either Right or Left
  //return Left({ ok: false, msg: "name not valid"});
  return true;
}

function validResult(result) {
  // return Left({ ok: false, msg: 'result is invalid'})
  return true;
}
