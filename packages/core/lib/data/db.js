const { is, of, apply, triggerEvent } = require('../utils')

const INVALID_DB_MSG = 'database name is not valid'
const INVALID_RESPONSE = 'response is not valid'

exports.create = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply('createDatabase'))
    .chain(triggerEvent('DATA:CREATE_DB'))
    .chain(is(validResponse, INVALID_RESPONSE))

exports.remove = (name) =>
  of(name)
    .chain(is(validDbName, INVALID_DB_MSG))
    .chain(triggerEvent('DATA:DELETE_DB'))
    .chain(apply('removeDatabase'))

exports.query = (db, query) =>
  of({ db, query })
    .chain(apply('queryDocuments'))
    .chain(triggerEvent('DATA:QUERY'))

exports.index = (db, name, fields) =>
  of({ db, name, fields })
    .chain(apply('indexDocuments'))
    .chain(triggerEvent('DATA:INDEX'))

exports.list = (db, options) =>
  of({ db, ...options })
    .chain(apply('listDocuments'))
    .chain(triggerEvent('DATA:LIST'))

exports.bulk = (db, docs) =>
  of({ db, docs })
    .chain(apply('bulkDocuments'))
    .chain(triggerEvent('DATA:BULK'))

function validDbName () {
  return true
}

function validResponse () {
  return true
}
