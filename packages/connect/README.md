<h1 align="center">⚡️ hyper-connect ⚡️</h1>
<p align="center">
hyper-connect is a client for [hyper](https://docs.hyper.io) - the client leverages the `Request` object from the fetch specification to construct a http request to send to the hyper server. The hyper-connect library handles all of the redundant details of a fetch request, so you can just specify the unique differences of your request.
</p>
<p align="center">
INSERT BADGES HERE
</p>

---

## Table of Contents

- [Getting Started](#getting-started)
- [Examples](#examples)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Getting Started

### Deno

```js
import connect from "https://x.nest.land/hyper-connect@VERSION/mod.js";

const HYPER = Deno.env.get("HYPER"); // connect string: cloud://key:secret@cloud.hyper.io/:app

const hyper = connect(HYPER)();

const docs = await fetch(await hyper.data.list()).then((r) => r.json());
const userSession = await fetch(await hyper.cache.get(user)).then((r) =>
  r.json()
);
const result = await fetch(await hyper.search.query(criteria)).then((r) =>
  r.json()
);
```

With hyper-connect you can access all of the hyper services and get back a
Request object via a promise, then you can add that request object to your fetch
call to invoke your request and receive a response.

### NodeJS

`npm install hyper-connect`

```js
import connect from "hyper-connect";

// > NOTE: You need to make fetch and Request available globally

const HYPER = process.env.get["HYPER"]; // connect string: cloud://key:secret@cloud.hyper.io/:app

const hyper = connect(HYPER)();

const docs = await hyper.data.list();
const userSession = await hyper.cache.get(user));

const result = await hyper.search.query(criteria);
```

---

## Examples

### How to add a document to hyper data?

```js
const doc = {
  id: "1",
  type: "movie",
  title: "Dune",
  year: "2021",
};

const req = await hyper.data.add(doc);
const response = await fetch(req);
if (response.ok) {
  const result = await response.json();
  console.log(result);
}
```

### How to get all the documents of type 'movie'?

```js
const req = await hyper.data.query({ type: "movie" });
const response = await fetch(req);
if (response.ok) {
  const result = await response.json();
  console.log(result);
}
```

### How to add a cache key/value pair to hyper cache?

```js
const req = await hyper.cache.add("key", { counter: 1 });
const response = await fetch(req);
if (response.ok) {
  const result = await response.json();
  console.log(result);
}
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
| search  | search | searches index by text                            |

---

### Contributing

---

### License

Apache 2.0
