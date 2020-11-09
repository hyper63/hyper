import { of, apply } from '../utils'


export const put = (bucket, object, stream) =>
  of({
    bucket,
    object,
    stream,
  }).chain(apply("putObject"));

export const get = (bucket, object) =>
  of({
    bucket,
    object,
  }).chain(apply("getObject"));

export const remove = (bucket, object) =>
  of({
    bucket,
    object,
  }).chain(apply("removeObject"));

export const list = (bucket, prefix) =>
  of({
    bucket,
    prefix,
  }).chain(apply("listObjects"));
