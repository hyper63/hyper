import { cuid, R } from '../../deps.ts'
import { apply, legacyGet, of, triggerEvent } from '../utils/mod.js'

const { defaultTo } = R

export const create = (db, doc) =>
  of(doc)
    .map(defaultTo({}))
    .map((doc) => ({ db, id: doc._id || cuid(), doc }))
    .chain(apply('createDocument'))
    .chain(triggerEvent('DATA:CREATE'))

export const get = (db, id) =>
  of({ db, id })
    .chain(apply('retrieveDocument'))
    .chain(triggerEvent('DATA:GET'))
    .chain(legacyGet('DATA:GET'))

export const update = (db, id, doc) =>
  of({ db, id, doc })
    .chain(apply('updateDocument'))
    .chain(triggerEvent('DATA:UPDATE'))

export const remove = (db, id) =>
  of({ db, id })
    .chain(apply('removeDocument'))
    .chain(triggerEvent('DATA:DELETE'))
