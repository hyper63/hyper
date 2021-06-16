import { apply, of, triggerEvent } from '../utils/mod.js'

export const put = (bucket, object, stream) =>
  of({
    bucket,
    object,
    stream
  }).chain(apply('putObject'))
    .chain(triggerEvent('STORAGE:PUT'))

export const get = (bucket, object) =>
  of({
    bucket,
    object
  }).chain(apply('getObject'))
    .chain(triggerEvent('STORAGE:GET'))

export const remove = (bucket, object) =>
  of({
    bucket,
    object
  }).chain(apply('removeObject'))
    .chain(triggerEvent('STORAGE:DELETE'))

export const list = (bucket, prefix) =>
  of({
    bucket,
    prefix
  }).chain(apply('listObjects'))
    .chain(triggerEvent('STORAGE:LIST'))
