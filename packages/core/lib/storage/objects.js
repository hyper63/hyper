const { of, apply, triggerEvent } = require('../utils')


exports.put = (bucket, object, stream) =>
  of({
    bucket,
    object,
    stream,
  }).chain(apply("putObject"))
    .chain(triggerEvent('STORAGE:PUT'));

exports.get = (bucket, object) =>
  of({
    bucket,
    object,
  }).chain(apply("getObject"))
    .chain(triggerEvent('STORAGE:GET'));

exports.remove = (bucket, object) =>
  of({
    bucket,
    object,
  }).chain(apply("removeObject"))
    .chain(triggerEvent('STORAGE:DELETE'));

exports.list = (bucket, prefix) =>
  of({
    bucket,
    prefix,
  }).chain(apply("listObjects"))
    .chain(triggerEvent('STORAGE:LIST'));
