import { apply, of, triggerEvent } from '../utils/mod.ts'

export const put = (bucket, object, stream, useSignedUrl) =>
  of({
    bucket,
    object,
    stream,
    useSignedUrl,
  }).chain(apply('putObject'))
    .chain(triggerEvent('STORAGE:PUT'))

export const get = (bucket, object, useSignedUrl) =>
  of({
    bucket,
    object,
    useSignedUrl,
  }).chain(apply('getObject'))
    .chain(triggerEvent('STORAGE:GET'))

export const remove = (bucket, object) =>
  of({
    bucket,
    object,
  }).chain(apply('removeObject'))
    .chain(triggerEvent('STORAGE:DELETE'))

export const list = (bucket, prefix) =>
  of({
    bucket,
    prefix,
  }).chain(apply('listObjects'))
    .chain(triggerEvent('STORAGE:LIST'))
