import { base64Encode, crocks, R } from "./deps.js";

const { Async } = crocks;
const { ifElse } = R;

// TODO: Tyler. wrap with opionated approach like before with https://github.com/vercel/fetch
const asyncFetch = (fetch) => Async.fromPromise(fetch);

const createHeaders = (username, password) => ({
  "Content-Type": "application/json",
  authorization: `Basic ${
    base64Encode(new TextEncoder().encode(username + ":" + password))
  }`,
});

const handleResponse = (pred) =>
  ifElse(
    (res) => pred(res),
    (res) => Async.fromPromise(() => res.json())(),
    (res) =>
      Async.fromPromise(() => res.json())()
        .chain(Async.Rejected),
  );

export { asyncFetch, createHeaders, handleResponse };
