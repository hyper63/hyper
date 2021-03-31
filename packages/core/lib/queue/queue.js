const { is, of, apply, triggerEvent } = require('../utils')
const { toLower, lensProp, over } = require('ramda')

const INVALID_NAME_MSG = 'queue name is not valid!';

exports.index = () =>
  apply('index')().chain(triggerEvent('QUEUE:INDEX'))  
  //apply('index')().chain(triggerEvent('QUEUE:INDEX'))

exports.create = (input) => 
  of(input)
    .map(over(lensProp('name'), toLower))
    .chain(is(validName, INVALID_NAME_MSG))
    .chain(apply("create"))
    .chain(triggerEvent('QUEUE:CREATE'))

exports['delete'] = (name) =>
  of(name)
    .chain(apply("delete"))
    .chain(triggerEvent('QUEUE:DELETE'))

exports.post = (input) =>
  of(input)
    .chain(apply('post'))
    .chain(triggerEvent('QUEUE:POST'))

exports.list = (input) =>
  of(input)
    .chain(apply('get'))
    .chain(triggerEvent('QUEUE:LIST'))

exports.cancel = (input) =>
  of(input)
    .chain(apply('cancel'))
    .chain(triggerEvent('QUEUE:CANCEL'))


function validName(input) {
  return /^[a-z0-9-]+$/.test(input.name);
}
