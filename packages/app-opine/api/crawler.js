import { R } from "../deps.js";
import { fork } from "../utils.js";

const { merge } = R;

export const upsert = ({ crawler, params, body }, res) =>
  fork(
    res,
    201,
    crawler.upsert(
      merge(body, { app: params.app, name: params.name }),
    ),
  );

export const get = ({ crawler, params }, res) =>
  fork(
    res,
    200,
    crawler.get(params.app, params.name),
  );

export const start = ({ crawler, params }, res) =>
  fork(
    res,
    200,
    crawler.start(params.app, params.name),
  );

export const del = ({ crawler, params }, res) =>
  fork(
    res,
    200,
    crawler.remove(params.app, params.name),
  );
