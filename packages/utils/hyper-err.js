import * as R from 'https://cdn.skypack.dev/ramda@0.28.0'

const {
  ifElse,
  evolve,
  __,
  compose,
  propEq,
  cond,
  complement,
  isNil,
  identity,
  is,
  T,
  filter,
  assoc,
  has,
  defaultTo,
  anyPass,
  allPass,
  isEmpty,
} = R

const isDefined = complement(isNil)
const rejectNil = filter(isDefined)
const isEmptyObject = allPass([
  complement(is(Array)), // not an array
  is(Object),
  isEmpty,
])
const checkIfDefined = (pred, msg) =>
  ifElse(
    isDefined,
    ifElse(pred, identity, () => {
      throw new Error(msg)
    }),
    identity,
  )

export const isHyperErr = allPass([
  propEq('ok', false),
  /**
   * should not have an _id.
   * Otherwise it's a document ie data.retrieveDocument
   * or cache.getDoc
   */
  complement(has('_id')),
])
// { ok: false } solely
export const isBaseHyperErr = allPass([
  isHyperErr,
  (err) => Object.keys(err).length === 1,
])

/**
 * Constructs a hyper-esque error
 *
 * @typedef {Object} HyperErrArgs
 * @property {string?} msg
 * @property {number?} status
 *
 * @typedef {Object} NotOk
 * @property {false} ok
 *
 * @param {(HyperErrArgs | string)} argsOrMsg
 * @returns {NotOk & HyperErrArgs} - the hyper-esque error
 */
export function HyperErr(argsOrMsg) {
  return compose(
    (r) => Object.assign(new.target ? this : {}, r), // enables using like a constructor and instanceof
    ({ ok, msg, status }) => rejectNil({ ok, msg, status }), // pick and filter nil
    evolve({
      ok: checkIfDefined(is(Boolean), 'ok must be a boolean'),
      msg: checkIfDefined(is(String), 'msg must be a string'),
      status: checkIfDefined(is(Number), 'status must be a number'),
    }),
    assoc('ok', false),
    cond([
      // string
      [is(String), assoc('msg', __, {})],
      // { msg?, status?, ok?: false }
      [
        anyPass([
          isEmptyObject,
          isBaseHyperErr,
          has('msg'),
          has('status'),
        ]),
        identity,
      ],
      // Fallthrough to error
      [T, () => {
        throw new Error(
          'HyperErr args must be a string or an object with msg and/or status',
        )
      }],
    ]),
    defaultTo({}),
  )(argsOrMsg)
}
