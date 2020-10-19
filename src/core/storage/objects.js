const { of, apply } = require("../utils");

exports.put = (bucket, object, stream) =>
  of({
    bucket,
    object,
    stream,
  }).chain(apply("putObject"));

exports.get = (bucket, object) =>
  of({
    bucket,
    object,
  }).chain(apply("getObject"));

exports.remove = (bucket, object) =>
  of({
    bucket,
    object,
  }).chain(apply("removeObject"));

exports.list = (bucket, prefix) =>
  of({
    bucket,
    prefix,
  }).chain(apply("listObjects"));
