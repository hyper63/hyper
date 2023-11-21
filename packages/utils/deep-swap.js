// @deno-types="npm:@types/ramda@^0.29.9"
import * as R from 'npm:ramda@0.29.1'

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
} = R

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
    ], acc)

  return compose(
    fromPairs,
    reduce(_reducer, []),
    toPairs,
  )(o)
})

const handleArrayProp = (a, b) => (k) =>
  (is(String, k) || is(Number, k) || is(Boolean, k)) ? k : deepSwap(a, b, k)

/**
 * @param {string} - source key
 * @param {string} - dest key
 * @param {Object} - object to deep swap
 */
export const deepSwap = curry(function (a, b, obj) {
  const _reducer = (acc, v) => {
    v[1] = cond([
      [is(Function), identity],
      [is(Array), map(handleArrayProp(a, b))],
      [is(Object), deepSwap(a, b)],

      [T, identity],
    ])(v[1])

    return { [v[0]]: v[1], ...acc }
  }

  return compose(
    reduce(_reducer, {}),
    toPairs,
    keySwap(a, b),
  )(obj)
})
