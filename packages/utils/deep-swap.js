import { R } from "./deps.js";

const {
  curry,
  compose,
  cond,
  append,
  ifElse,
  equals,
  always,
  identity,
  fromPairs,
  toPairs,
  is,
  map,
  reduce,
  T,
} = R;

/**
 * @param {string} a - source key
 * @param {string} b - destination key
 * @param {object} o - object to do swap
 */
const keySwap = curry((a, b, o) => {
  const _reducer = (acc, v) =>
    append([
      ifElse(equals(a), always(b), identity)(v[0]),
      v[1],
    ], acc);

  return compose(
    fromPairs,
    reduce(_reducer, []),
    toPairs,
  )(o);
});

/**
 * @param {string} - source key
 * @param {string} - dest key
 * @param {Object} - object to deep swap
 */
export const deepSwap = curry(function (a, b, obj) {
  const _reducer = (acc, v) => {
    v[1] = cond([
      [is(Function), identity],
      [is(Array), map(deepSwap(a, b))],
      [is(Object), deepSwap(a, b)],
      [T, identity],
    ])(v[1]);

    return { [v[0]]: v[1], ...acc };
  };

  return compose(
    reduce(_reducer, {}),
    toPairs,
    keySwap(a, b),
  )(obj);
});
