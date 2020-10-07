const Async = require("crocks/Async");
const ReaderT = require("crocks/Reader/ReaderT");
const compose = require("crocks/helpers/compose");
const Either = require("crocks/Either");
const eitherToAsync = require("crocks/Async/eitherToAsync");
const AsyncReader = ReaderT(Async);
const { ask, lift } = AsyncReader;

const { Left, Right } = Either;

const doValidate = (pred, msg) => (value) =>
  pred(value) ? Right(value) : Left({ ok: false, msg });

exports.Do = (fn, msg) => compose(lift, eitherToAsync, doValidate(fn, msg));
exports.AsyncReader = AsyncReader;
exports.apply = (method) => (data) =>
  ask((svc) =>
    svc[method](data).map((v) => {
      svc.close();
      return v;
    })
  ).chain(lift);
exports.of = AsyncReader.of;
