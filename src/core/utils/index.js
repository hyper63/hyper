const Async = require("crocks/Async");
const ReaderT = require("crocks/Reader/ReaderT");
const compose = require("crocks/helpers/compose");
const Either = require("crocks/Either");
const eitherToAsync = require("crocks/Async/eitherToAsync");
const { of, ask, lift } = ReaderT(Async);

const { Left, Right } = Either;

const doValidate = (pred, msg) => (value) =>
  pred(value) ? Right(value) : Left({ ok: false, msg });

/**
 * takes a predicate function and error message
 * if the predicate function fails then returns an object with an error message
 * if the predicate function passes then the value is passed down the chain
 */
export const is = (fn, msg) => compose(lift, eitherToAsync, doValidate(fn, msg));
/**
 * uses the reader monad to get the environment, in this case a service
 * module and invokes a method on that module passing the data from the
 * pipeline as the arguments
 */
export const apply = (method) => (data) =>
  ask((svc) => svc[method](data)).chain(lift);

/**
 * constructor for an AsyncReader monad
 */
export const of = of;
