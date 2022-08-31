<h1 align="center">⚡️ hyper-connect ⚡️</h1>
<p align="center">
hyper-connect is a client for <a href="https://docs.hyper.io">hyper</a>
</p>
<p align="center">
<a href="https://nest.land/package/hyper-connect"><img src="https://nest.land/badge.svg" alt="Nest Badge" /></a>
  <a href="https://github.com/hyper63/hyper63/actions/workflows/test-connect.yml"><img src="https://github.com/hyper63/hyper63/actions/workflows/test-connect.yml/badge.svg" alt="Test" /></a>
</p>

---

## Table of Contents

- [Install](#install)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Install

### NodeJS

```sh
npm install hyper-connect
```

`hyper-connect` constructs a
[Request Object](https://developer.mozilla.org/en-US/docs/Web/API/Request) and
sends it to the hyper server using `fetch`. `hyper-connect` wraps your hyper
app's REST API, generating short-lived JWTs using the provided connection
string.

## Getting Started

> New Experimental Feature: hyper Queue worker support,
> [see below](#verify-signature)

### NodeJS (TypeScript)

```ts
import { connect } from "hyper-connect";

const hyper = connect(process.env.HYPER as string);

await hyper.data.add({ id: "game-1", type: "game", name: "Donkey Kong" });
await hyper.data.add({ id: "game-2", type: "game", name: "Pac Man" });
await hyper.data.add({ id: "game-3", type: "game", name: "Galaga" });

const results = await hyper.data.query({ type: "game" });
```

### NodeJS (ESM)

```js
import { connect } from "hyper-connect";

const hyper = connect(process.env.HYPER);

await hyper.data.add({ id: "game-1", type: "game", name: "Donkey Kong" });
await hyper.data.add({ id: "game-2", type: "game", name: "Pac Man" });
await hyper.data.add({ id: "game-3", type: "game", name: "Galaga" });

const results = await hyper.data.query({ type: "game" });
```

### NodeJS (CJS)

```js
const { connect } = require("hyper-connect");

const hyper = connect(process.env.HYPER);

await hyper.data.add({ id: "game-1", type: "game", name: "Donkey Kong" });
await hyper.data.add({ id: "game-2", type: "game", name: "Pac Man" });
await hyper.data.add({ id: "game-3", type: "game", name: "Galaga" });

const results = await hyper.data.query({ type: "game" });
```

### A Note for NodeJS

For Node environments, starting with `v0.5.0`, `hyper-connect`'s Storage service
api returns a
[`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
instead of a `NodeJS.ReadableStream`. If you'd like a `NodeJS.ReadableStream`,
follow one of the approaches below.

If you're using `node>=17`, you can use Node's built in `fromWeb` to get a Node
stream:

```js
import { Readable } from "node:stream";

const res = await hyper.storage.download(name);
const readableNodeStream = Readable.fromWeb(res);
```

Otherwise, you will need to use `v0.4.0` or less of `hyper-connect`. Node `18`
will be in LTS soon, and we recommend upgrading to Node `18` LTS as soon as
possible, to take advantage of the new Web Standards centric features, like
global `fetch` and `WebStreams`.

### Deno

```js
import { connect } from "https://x.nest.land/hyper-connect@VERSION/deno/mod.ts";

const HYPER = Deno.env.get("HYPER"); // connect string: cloud://key:secret@cloud.hyper.io/:app

const hyper = connect(HYPER)();

await hyper.data.add({ id: "game-1", type: "game", name: "Donkey Kong" });
await hyper.data.add({ id: "game-2", type: "game", name: "Pac Man" });
await hyper.data.add({ id: "game-3", type: "game", name: "Galaga" });

const results = await hyper.data.query({ type: "game" });
```

With hyper-connect, you can access all of the hyper services. hyper-connect uses
the fetch library to execute REST requests for you.

## Examples

### How to add a document to hyper data?

```js
const doc = {
  id: "movie-1",
  type: "movie",
  title: "Dune",
  year: "2021",
};

const result = await hyper.data.add(doc);
console.log(result); // {ok: true, id: "movie-1"}
```

### How to get all the documents of type 'movie'?

```js
const result = await hyper.data.query({ type: "movie" });
console.log(result); // {ok: true, docs: [...]}
```

### How to add a cache key/value pair to hyper cache?

```js
const result = await hyper.cache.add("key", { counter: 1 });
console.log(result); // {ok: true}
```

## Documentation

hyper is a suite of service apis, with hyper connect you can specify the api you
want to connect with and the action you want to perform.
hyper.[service].[action] - with each service there are a different set of
actions to call. This table breaks down the service and action with description
of the action.

### data

| Service | Action | Description                                                         |
| ------- | ------ | ------------------------------------------------------------------- |
| data    | add    | creates a json document in the hyper data store                     |
| data    | list   | lists the documents given a start,stop,limit range                  |
| data    | get    | retrieves a document by id                                          |
| data    | update | updates a given document by id                                      |
| data    | remove | removes a document from the store                                   |
| data    | query  | queries the store for a set of documents based on selector criteria |
| data    | index  | creates an index for the data store                                 |
| data    | bulk   | inserts, updates, and removed document via a batch of documents     |

### cache

| Service | Action | Description                                                         |
| ------- | ------ | ------------------------------------------------------------------- |
| cache   | add    | creates a json document in the hyper cache store with a key         |
| cache   | get    | retrieves a document by key                                         |
| cache   | set    | sets a given document by key                                        |
| cache   | remove | removes a document from the cache                                   |
| cache   | query  | queries the cache for a set of documents based on a pattern matcher |

### search

| Service | Action | Description                                       |
| ------- | ------ | ------------------------------------------------- |
| search  | add    | indexes a json document in the hyper search index |
| search  | get    | retrieves a document from index                   |
| search  | remove | removes a document from the index                 |
| search  | query  | searches index by text                            |
| search  | load   | loads a batch of documents                        |

### storage

| Service | Action   | Description                              |
| ------- | -------- | ---------------------------------------- |
| storage | upload   | adds object/file to hyper storage bucket |
| storage | download | retrieves a object/file from bucket      |
| storage | remove   | removes a object/file from the bucket    |

### queue

| Service | Action  | Description                                                |
| ------- | ------- | ---------------------------------------------------------- |
| queue   | enqueue | posts object to queue                                      |
| queue   | errors  | gets list of errors occured with queue                     |
| queue   | queued  | gets list of objects that are queued and ready to be sent. |

---

### Verify Signature

hyper Queue allows you to create a target web hook endpoint to receive jobs, in
order to secure that endpoint to only receive jobs from hyper, you can implement
a secret, this secret using sha256 to encode a `nounce` timestamp and a
signature of the job payload. We created a function on `hyper-connect` to make
it easier to implement your own middleware to validate these incoming jobs in a
secure way.

```js
import { createHyperVerify } from 'hyper-connect'

const signatureVerify = createHyperVerify(process.env.QUEUE_SECRET, '1m')

export const validateSignature(req, res, next) {
  const result = signatureVerify(req.headers.get('x-hyper-signature'), req.body))
  if (!result.ok) {
    return res.setStatus(result.status).send({msg: result.msg})
  }
  next()
}
```

### Contributing

- `make test` to run unit tests
- `make test-integration` to run integration tests. This ensures the Deno code
  is properly transformed into Node code.

---

### License

Apache 2.0
