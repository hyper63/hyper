# Atlas Cache Documentation

## Summary

The atlas cache api allows the application to create cache stores and read/write json documents to those stores by providing a key for each json document and an optional ttl or time to live period for the cached document. A cache can be very useful to provide fast access to specific data if the data has not changed recently. Leveraging a cache can provide a significant boost in terms of scale and performance for an application.

## Usage

```sh
docker run ...
```

## Testing

```sh
yarn test:cache
```

## Requirements

To create a cache api, I need to be able to

- create a cache store
- add a key and value to a cache store, with a TTL option
- get a value from a key
- update a value to a key resetting TTL
- remove a key value pair
- get a specific list of values by their keys
- get a set of keys by range searches of partial key values

All keys must be strings - with no spaces, no slashes, and uri safe
All values must be valid json

## API

Create cache store

```
PUT /micro/cache/:name
```

Delete cache store

```
DELETE /micro/cache/:name
```

Add key/value to cache

```
POST /micro/cache/:name
content-type: application/json

{
  "key": "KEY",
  "value": {"HELLO": "WORLD"},
  "ttl": "2d"
}
```

Get a value from key

```
GET /micro/cache/:name/:key
```

Update a value for a key

```
PUT /micro/cache/:name/:key?ttl=1h

{
  "HELLO": "MARS"
}
```

Delete a key

```
DELETE /micro/cache/:name/:key
```

Query store

```
POST /micro/cache/:name/_query?pattern=*
```

List keys for a store

```
GET /micro/cache/:name
```

List keys by pattern

```
GET /micro/cache/:name?pattern=foo* // all keys start with foo
```

## Adapter specification

By using the adapter pattern, we can leverage many different datasources for our cache system. The adapter just has to implement the following interface:

```js
module.exports = (env) => ({
  createStore: (name) => null,
  destroyStore: (name) => null,
  createDoc: ({ store, key, value, ttl }) => null,
  getDoc: ({ store, key }) => null,
  updateDoc: ({ store, key, value }) => null,
  deleteDoc: ({ store, key }) => null,
  listDocs: ({ store, pattern }) => null,
});
```

For some examples check out the services folder:

- redis
- memory
- memcache
