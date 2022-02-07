import { R } from "../deps.js";
import { fork } from "../utils.js";

const { mergeRight } = R;

export const upsert = ({ crawler, params, body }, res) =>
  fork(
    res,
    201,
    crawler.upsert(
      mergeRight(body, { app: params.bucket, name: params.name }),
    ),
  );

export const get = ({ crawler, params }, res) =>
  fork(
    res,
    200,
    crawler.get(params.bucket, params.name),
  );

export const start = ({ crawler, params }, res) =>
  fork(
    res,
    200,
    crawler.start(params.bucket, params.name),
  );

export const del = ({ crawler, params }, res) =>
  fork(
    res,
    200,
    crawler.remove(params.bucket, params.name),
  );
