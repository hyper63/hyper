import { R, z } from "../../deps.js";

const { ZodError, ZodIssueCode } = z;

const {
  __,
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
  flatten,
  assoc,
  has,
  defaultTo,
  anyPass,
  allPass,
  equals,
  reduce,
  isEmpty,
} = R;

const isDefined = complement(isNil);
const rejectNil = filter(isDefined);
const isEmptyObject = allPass([
  complement(is(Array)), // not an array
  is(Object),
  isEmpty,
]);

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
const gatherZodIssues = (zodErr, contextCode) =>
  reduce(
    (issues, issue) => {
      const _issues = cond([
        /**
         * These issue codes indicate nested ZodErrors
         * so we resursively gather those
         *
         * See https://github.com/colinhacks/zod/blob/HEAD/ERROR_HANDLING.md#zodissuecode
         */
        [equals(ZodIssueCode.invalid_arguments), () =>
          gatherZodIssues(
            issue.argumentsError,
            ZodIssueCode.invalid_arguments,
          )],
        [equals(ZodIssueCode.invalid_return_type), () =>
          gatherZodIssues(
            issue.returnTypeError,
            ZodIssueCode.invalid_return_type,
          )],
        [
          equals(ZodIssueCode.invalid_union),
          // An array of ZodErrors, so map over and flatten them all
          () =>
            flatten(issue.unionErrors.map((i) =>
              gatherZodIssues(i, ZodIssueCode.invalid_union)
            )),
        ],
        [T, () => [{ ...issue, contextCode }]],
      ])(issue.code);

      return issues.concat(_issues);
    },
    [],
    zodErr.issues,
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
        return acc.concat([`${contextCode}${_path}(${code}) - ${message}`]);
      },
      [],
      zodIssues,
    ),
  (zodErr) => gatherZodIssues(zodErr, ""),
);

export const HyperErrFrom = (err) =>
  compose(
    assoc("originalErr", err),
    ifElse(
      is(ZodError),
      // handle ZodErrors mapped to HyperErr
      zodErrToHyperErr,
      // fuzzy mapping to HyperErr
      (err) => HyperErr({ msg: mapErr(err), status: mapStatus(err.status) }),
    ),
    defaultTo({ msg: "An error occurred" }),
  )(err);

export const isHyperErr = allPass([
  has("ok"), // { ok }
  complement(prop("ok")), // { ok: false }
]);
