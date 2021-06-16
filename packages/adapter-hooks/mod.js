import { crocks, R } from "./deps.js";

import createAdapter from "./adapter.js";

const { merge } = R;
const { Async } = crocks;

// TODO: Tyler. wrap with opionated approach like before with https://github.com/vercel/fetch
const asyncFetch = Async.fromPromise(fetch);

export default function (hooks) {
  return Object.freeze({
    id: "hooks",
    port: "hooks",
    load: merge({ hooks }),
    link: () => () => createAdapter({ asyncFetch, hooks }),
  });
}
