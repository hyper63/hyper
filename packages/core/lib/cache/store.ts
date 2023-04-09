import { type CachePort, R } from '../../deps.ts'

import { apply, is, of, triggerEvent } from '../utils/mod.ts'

const { toLower } = R

const checkNameIsValid = is((name: string) => {
  // verify that the name does not contains spaces
  // verify that the name does not contain slashes
  // verify that the name contains URI friendly characters
  // cache names should only start with alphanumeric characters
  // should return a true or false
  return /^[a-z0-9]+$/.test(name[0]) && /^[a-z0-9-~_]+$/.test(name)
}, 'name is not valid')

export const index = () =>
  /**
   * Type is wrong. No argument is needed
   */
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  apply<CachePort, 'index'>('index')().chain(triggerEvent('CACHE:INDEX'))

/**
 * @param {string} name
 */
export const create = (name: string) =>
  of(name)
    .map(toLower)
    .chain(checkNameIsValid)
    .chain(apply<CachePort, 'createStore'>('createStore'))
    .chain(triggerEvent('CACHE:CREATE_STORE'))

/**
 * @param {string} name
 */
export const del = (name: string) =>
  of(name)
    .chain(checkNameIsValid)
    .chain(apply<CachePort, 'destroyStore'>('destroyStore'))
    .chain(triggerEvent('CACHE:DELETE_STORE'))

/**
 * @param {string} name
 * @param {string} pattern
 */
export const query = (name: string, pattern: string) =>
  of(name)
    .chain(checkNameIsValid)
    .map((name) => ({ store: name, pattern }))
    .chain(apply<CachePort, 'listDocs'>('listDocs'))
    .chain(triggerEvent('CACHE:LIST'))
