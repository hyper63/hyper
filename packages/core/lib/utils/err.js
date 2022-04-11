import {
  crocks,
  HyperErr,
  isBaseHyperErr,
  isHyperErr,
  R,
  z,
} from "../../deps.js";

const { ZodError, ZodIssueCode } = z;

const { Async } = crocks;

const {
  compose,
  concat,
  converge,
  find,
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
  flatten,
  assoc,
  defaultTo,
  equals,
  reduce,
  unapply,
  map,
  apply,
  pluck,
  applySpec,
} = R;

const isDefined = complement(isNil);
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
 * Take a ZodError and flatten it's issues into a single depth array
 *
 * Some ZodErrors can have nested ZodErrors within it's issues,
 * so we recursively pull those out
 *
 * @param {ZodError} zodErr
 * @returns {[ZodError]} - all errors
 */
const gatherZodIssues = (zodErr, status, contextCode) =>
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
            () =>
              gatherZodIssues(issue.argumentsError, 422, "Invalid Arguments"),
          ],
          [
            equals(ZodIssueCode.invalid_return_type),
            () =>
              gatherZodIssues(
                issue.returnTypeError,
                500,
                "Invalid Return",
              ),
          ],
          [
            equals(ZodIssueCode.invalid_union),
            // An array of ZodErrors, so map over and flatten them all
            () =>
              compose(
                flatten,
                map((i) => gatherZodIssues(i, 400, "Invalid Union")),
              )(issue.unionErrors),
          ],
          [T, () => [{ ...issue, status, contextCode }]],
        ]),
      )(issue.code),
    [],
    zodErr.issues,
  );

const zodErrToHyperErr = compose(
  HyperErr,
  applySpec({
    status: compose(
      // 500 > 422 > 400 (choose the most high priority status code)
      apply(Math.max),
      pluck("status"),
    ),
    // combine all errors
    msg: compose(
      join(" | "),
      pluck("msg"),
    ),
  }),
  // combine all zod errors into a list of { msg, status } summaries of each error
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
        const { status, message, path, contextCode } = zodIssue;

        /**
         * all hyper adapter methods receive either a single string or single object
         *
         * if object, path[1] will be the object key and path[0] '0'
         * if string, path[0] will be the string and path[1] undefined
         */
        const _path = path[1] || path[0];
        const _contextCode = contextCode ? `${contextCode} ` : "";

        // TODO: is this formatting okay?
        return concat(acc, [
          {
            status,
            msg: `${_contextCode}'${_path}': ${message}.`,
          },
        ]);
      },
      [],
      zodIssues,
    ),
  (zodErr) => gatherZodIssues(zodErr, 400, ""),
);

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

export const rejectHyperErr = ifElse(
  isHyperErr,
  Async.Rejected,
  Async.Resolved,
);

export const handleHyperErr = ifElse(
  isHyperErr,
  Async.Resolved,
  Async.Rejected,
);
