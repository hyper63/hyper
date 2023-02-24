import { R } from '../../deps.js'

import { apply, is, of, triggerEvent } from '../utils/mod.js'

const { toLower, lensProp, over } = R

const INVALID_NAME_MSG = 'queue name is not valid!'

export const index = () => apply('index')().chain(triggerEvent('QUEUE:INDEX'))
// apply('index')().chain(triggerEvent('QUEUE:INDEX'))

export const create = (input) =>
  of(input)
    .map(over(lensProp('name'), toLower))
    .chain(is(validName, INVALID_NAME_MSG))
    .chain(apply('create'))
    .chain(triggerEvent('QUEUE:CREATE'))

export const del = (name) =>
  of(name)
    .chain(apply('delete'))
    .chain(triggerEvent('QUEUE:DELETE'))

export const post = (input) =>
  of(input)
    .chain(apply('post'))
    .chain(triggerEvent('QUEUE:POST'))

export const list = (input) =>
  of(input)
    .chain(apply('get'))
    .chain(triggerEvent('QUEUE:LIST'))

export const cancel = (input) =>
  of(input)
    .chain(apply('cancel'))
    .chain(triggerEvent('QUEUE:CANCEL'))

function validName(input) {
  return /^[a-z0-9-~_]+$/.test(input.name)
}
