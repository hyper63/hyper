import { crocks, R } from "./deps.js";

const { Async, composeK } = crocks;
const { ifElse, propEq } = R;

export const asyncFetch = (fetch) => Async.fromPromise(fetch);
export const createHeaders = (username, password) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (username) {
    headers.authorization = `Basic ${btoa(username + ":" + password)}`;
  }
  return headers;
};

const toJSON = (result) => Async.fromPromise(result.json.bind(result))();
const toJSONReject = composeK(Async.Rejected, toJSON);

export const handleResponse = (code) =>
  ifElse(propEq("status", code), toJSON, toJSONReject);
