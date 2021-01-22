# hyper63 client

> This is an opinionated client library, leveraging `Async` from `crocks` as the pipeline pattern. Checkout https://crocks.dev/docs/crocks/Async.html

This client is built to work with the hyper63 nano configuration, that uses
hmca HS256 algorithm for security and express REST application. You can check out the hyper63 default implementation here: https://github.com/twilson63/hyper63-nano-server

hyper63 is a modular service framework that can have different application
interface implementations and different adapters for its ports, data, cache,
storage, and search. This client depends on the @hyper63/app-express interface,
using a JWT middleware.

## Install

```
npm install @hyper63/client
```

## Usage

```js
const createClient = require("@hyper63/client");
const client = createClient(host, key, secret, app);

client.setup
  .db()
  .chain(() => client.data.create({ hello: "world" }))
  .fork(console.log.bind(console), console.log.bind(console));
```

## API

### createClient

In order to create a hyper63 client, you will need 4 arguments:

- host - the server url for hyper63
- key - the unique name of this application
- secret - the hmsa secret that the hyper63 server and the nodejs client needs to know for JWT signing and verifying.
- app - the name of the application stores in hyper63

```js
const client = createClient(
  "https://nano.hyper63.com",
  "my-app",
  "a-shared-secret-for-jwt-token",
  "my-data-store-name"
);
```

### Setup API

```js
Async.all([
  client.setup.db(), // sets up database
  client.setup.cache(),
  client.setup.search({ fields: ["title"], storeFields: ["title"] }),
]).fork(console.log.bind(console), console.log.bind(console));
```

### Data API

- client.data.create - creates document
- client.data.get - gets document
- client.data.update - updates document
- client.data.list - list documents
- client.data.remove - remove document
- client.data.query - query documents
- client.data.index - create index for query

### Cache API

- client.cache.post - creates cache key/value
- client.cache.get - gets value by key
- client.cache.put - updates value with key
- client.cache.query - find keys by pattern
- client.cache.remove - remove key/value pair

### Search API

- client.search.create - adds a doc to search index
- client.search.remove - removes a doc from the search index

## License

Apache-2.0
