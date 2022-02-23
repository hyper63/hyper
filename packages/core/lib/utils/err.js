import { R, z } from "../../deps.js";

const { ZodError, ZodIssueCode } = z;

const {
  __,
  compose,
  concat,
  curry,
  converge,
  find,
  prop,
  propEq,
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
  flatten,
  assoc,
  has,
  defaultTo,
  anyPass,
  allPass,
  equals,
  reduce,
  isEmpty,
  unapply,
  map,
} = R;

const isDefined = complement(isNil);
const rejectNil = filter(isDefined);
const isEmptyObject = allPass([
  complement(is(Array)), // not an array
  is(Object),
  isEmpty,
]);
const toPropTuple = (fn) =>
  (propName) => [
    compose(
      isDefined,
      prop(propName),
    ),
    (val) => fn(prop(propName, val)),
  ];

const mapErrPropTuple = toPropTuple((err) => mapErr(err));

const condElseUndefined = (tuple) =>
  cond([
    tuple,
    [T, () => undefined],
  ]);

/**
 * Takes a value and attempts to traverse it and produce
 * a string.
 *
 * If an object is received, this fn will recursively depth-first traverse multiple fields
 * on the object in an attempt to find a value.
 *
 * If more than one value is resolved in that traversal,
 * then this fn will prefer values resolved from fields according to this order:
 * - msg
 * - message
 * - error
 * - errors
 *
 * ie { msg: 'foo', error: 'bar' } will resolve to 'foo'
 * this also applies to all recursive traversals, regardless of depth
 * ie { msg: { msg: 'fizz', error: 'foo' }, error: 'bar' } will resolve to 'fizz'
 *
 * always return a string
 */
export const mapErr = converge(
  compose(
    defaultTo("An error occurred"),
    unapply(find(isDefined)),
  ),
  [
    // string
    condElseUndefined([is(String), identity]),
    // { msg } catches HyperErr, ie. it was inadvertantly thrown instead of resolved from adapter
    condElseUndefined(mapErrPropTuple("msg")),
    // { message } catches both Error, and Object with message prop
    condElseUndefined(mapErrPropTuple("message")),
    // { error } subkey
    condElseUndefined(mapErrPropTuple("error")),
    // { errors } subkey
    condElseUndefined(mapErrPropTuple("errors")),
    // []
    condElseUndefined([
      is(Array),
      compose(
        join(", "),
        map((err) => mapErr(err)), // recurse
      ),
    ]),
    // any non nil
    condElseUndefined([isDefined, (val) => JSON.stringify(val)]),
  ],
);

const mapStatusPropTuple = toPropTuple((err) => mapStatus(err));

/**
 * Takes a value and attempts to traverse it and produce
 * a number status code.
 *
 * If an object is received, this fn will recursively depth-first traverse multiple fields
 * on the object in an attempt to find a value.
 *
 * If more than one value is resolved in that traversal,
 * then this fn will prefer values resolved from fields according to this order:
 * - status
 * - statusCode
 *
 * ie { status: 200, statusCode: 400 } will resolve to 200
 * this also applies to all recursive traversals, regardless of depth
 * ie { status: { statusCode: 200 }, statusCode: 400 } will resolve to 200
 *
 * always return a number or undefined
 */
export const mapStatus = converge(
  unapply(find(isDefined)), // undefined if nothing found,
  [
    condElseUndefined([is(Number), identity]),
    condElseUndefined([
      is(String),
      compose(
        ifElse(
          isNaN,
          always(undefined),
          identity,
        ),
        (status) => parseInt(status, 10),
      ),
    ]),
    // { status }
    condElseUndefined(mapStatusPropTuple("status")),
    // { statusCode }
    condElseUndefined(mapStatusPropTuple("statusCode")),
  ],
);

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
const HyperErr = (argsOrMsg) =>
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

/**
 * Take a ZodError and flatten it's issues into a single depth array
 *
 * Some ZodErrors can have nested ZodErrors within it's issues,
 * so we recursively pull those out
 *
 * @param {ZodError} zodErr
 * @returns {[ZodError]} - all errors
 */
const gatherZodIssues = curry((zodErr, contextCode) =>
  reduce(
    (issues, issue) =>
      compose(
        concat(issues),
        cond([
          /**
           * These issue codes indicate nested ZodErrors
           * so we resursively gather those
           *
           * See https://github.com/colinhacks/zod/blob/HEAD/ERROR_HANDLING.md#zodissuecode
           */
          [
            equals(ZodIssueCode.invalid_arguments),
            gatherZodIssues(issue.argumentsError),
          ],
          [
            equals(ZodIssueCode.invalid_return_type),
            gatherZodIssues(issue.returnTypeError),
          ],
          [
            equals(ZodIssueCode.invalid_union),
            // An array of ZodErrors, so map over and flatten them all
            (code) =>
              compose(
                flatten,
                map((i) => gatherZodIssues(i, code)),
              )(issue.unionErrors),
          ],
          [T, () => [{ ...issue, contextCode }]],
        ]),
      )(issue.code),
    [],
    zodErr.issues,
  )
);

const zodErrToHyperErr = compose(
  HyperErr,
  join(" | "),
  // combine all zod errors into a list of string summaries of each error
  (zodIssues) =>
    reduce(
      (acc, zodIssue) => {
        /**
         * TODO:
         * Separate handling for each error type
         * See https://github.com/colinhacks/zod/blob/HEAD/ERROR_HANDLING.md#zodissuecode
         *
         * For now, just focus on shared props
         * See https://github.com/colinhacks/zod/blob/HEAD/ERROR_HANDLING.md#zodissue
         */
        let { code, message, path, contextCode } = zodIssue;

        /**
         * all hyper adapter methods receive either a single string or single object
         *
         * if object, path[1] will be the object key and path[0] '0'
         * if string, path[0] will be the string and path[1] undefined
         */
        const _path = path[1] || path[0];
        contextCode = contextCode ? `${contextCode}: ` : "";

        // TODO: is this formatting okay?
        return concat(acc, [`${contextCode}${_path}(${code}) - ${message}`]);
      },
      [],
      zodIssues,
    ),
  (zodErr) => gatherZodIssues(zodErr, ""),
);

export const isHyperErr = propEq("ok", false);

// { ok: false } solely
const isBaseHyperErr = allPass([
  isHyperErr,
  (err) => Object.keys(err).length === 1,
]);

export const HyperErrFrom = (err) =>
  compose(
    assoc("originalErr", err),
    ifElse(
      isBaseHyperErr, // simply return errors of shape { ok: false }
      identity,
      ifElse(
        is(ZodError),
        // handle ZodErrors mapped to HyperErr
        zodErrToHyperErr,
        // fuzzy mapping to HyperErr
        (err) => HyperErr({ msg: mapErr(err), status: mapStatus(err) }),
      ),
    ),
    defaultTo({ msg: "An error occurred" }),
  )(err);
