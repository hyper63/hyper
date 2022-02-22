import { R } from "../../deps.js";

const {
  compose,
  prop,
  cond,
  complement,
  isNil,
  identity,
  is,
  join,
  T,
  ifElse,
  always,
  filter,
  assoc,
  has,
  defaultTo,
} = R;

const isDefined = complement(isNil);
const rejectNil = filter(isDefined);

const ifPropTuple = (fn) =>
  (propName) => [
    compose(
      isDefined,
      prop(propName),
    ),
    (val) => fn(prop(propName, val)),
  ];

const mapErrPropTuple = ifPropTuple((err) => mapErr(err));

// always return a string
export const mapErr = cond([
  // string
  [is(String), identity],
  // { message } catches both Error, and Object with message prop
  mapErrPropTuple("message"),
  // { msg } catches HyperErr, ie. it was inadvertantly thrown instead of resolved from adapter
  mapErrPropTuple("msg"),
  // { error } subkey
  mapErrPropTuple("error"),
  // { errors } subkey
  mapErrPropTuple("errors"),
  // []
  [
    is(Array),
    compose(
      join(", "),
      (errs) => errs.map(mapErr), // recurse
    ),
  ],
  // any non nil
  [isDefined, (val) => JSON.stringify(val)],
  // nil
  [T, () => "An error occurred"],
]);

// always return a number or undefined
export const mapStatus = cond([
  [is(Number), identity],
  [
    is(String),
    compose(
      ifElse(
        isNaN,
        always(undefined),
        identity,
      ),
      (status) => parseInt(status, 10),
    ),
  ],
  // anything else
  [T, always(undefined)],
]);

/**
 * Constructs a hyper-esque error
 *
 * @typedef {Object} HyperErrArgs
 * @property {string} msg
 * @property {string?} status
 *
 * @typedef {Object} NotOk
 * @property {false} ok
 *
 * @param {(HyperErrArgs | string)} argsOrMsg
 * @returns {NotOk & HyperErrArgs} - the hyper-esque error
 */
export const HyperErr = (argsOrMsg) =>
  compose(
    ({ ok, msg, status }) => rejectNil({ ok, msg, status: mapStatus(status) }), // pick and filter nil
    assoc("ok", false),
    cond([
      // string
      [is(String), assoc("msg", __, {})],
      // { msg?, status? }
      [
        anyPass([
          isEmptyObject,
          has("msg"),
          has("status"),
        ]),
        identity,
      ],
      // Fallthrough to error
      [T, () => {
        throw new Error(
          "HyperErr args must be a string or an object with msg or status",
        );
      }],
    ]),
    defaultTo({}),
  )(argsOrMsg);

export const HyperErrFrom = err => compose(
  assoc("originalErr", err),
  HyperErr, // should always receive { msg, status }
  (err) => ({ msg: mapErr(err), status: mapStatus(err.status) }),
  defaultTo({ msg: "An error occurred" }),
)(err);

export const isHyperErr = allPass([
  has("ok"), // { ok }
  complement(prop("ok")), // { ok: false }
]);
