import { crocks, R, z } from "../deps.js";

const { Identity } = crocks;
const { is, append, map } = R;

const fnSpec = z.function()
  .args(z.object({
    type: z.string(),
    payload: z.any(),
  }));

/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {Object} payload
 */
export default function () {
  let fns = Identity([]); // maybe change to Either to handle tryCatch
  return Object.freeze({
    /**
     * @param {Function} fn
     */
    subscribe(fn) {
      if (is(Function, fn)) {
        // append function
        fns = fns.map(append(fnSpec.validate(fn)));
      }
    },
    /**
     * @param {Action} action
     */
    dispatch(action) {
      map(
        (fn) => fn(action),
        fns.valueOf(),
      );
    },
  });
}
