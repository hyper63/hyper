import { apply, of, triggerEvent } from '../utils/mod.ts'

// const INVALID_BUCKET_MSG = 'bucket name is not valid'
// const INVALID_RESPONSE = 'response is not valid'

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
export const make = (name) =>
  of(name)
    // .chain(is(validDbName, INVALID_DB_MSG))
    .chain(apply('makeBucket'))
    .chain(triggerEvent('STORAGE:CREATE_BUCKET'))
// .chain(is(validResponse, INVALID_RESPONSE));

/**
 * @param {string} name
 * @returns {AsyncReader}
 */
export const remove = (name) =>
  of(name)
    .chain(apply('removeBucket'))
    .chain(triggerEvent('STORAGE:DELETE_BUCKET'))

/**
 * @returns {AsyncReader}
 */
export const list = () => of().chain(apply('listBuckets'))
