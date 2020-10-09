# Atlas Cache Documentation

## Summary

The atlas cache api allows the application to create cache stores and read/write json documents to those stores by providing a key for each json document and an optional ttl or time to live period for the cached document. A cache can be very useful to provide fast access to specific data if the data has not changed recently. Leveraging a cache can provide a significant boost in terms of scale and performance for an application.

## How it works

Atlas runs as a web service usually on port 6363, and to access the cache module you will use the url path:

`/micro/cache`

Your server application can access the REST interface using an httpClient. A simple way to test the interface is to use `curl`

```sh
curl localhost:6363/micro/cache
```

You will get back a json response:

```json
{ "name": "Atlas Cache", "version": "1.0", "status": "unstable" }
```

For more commands, see the api section below.

## Usage

> NOTE: you will need docker installed: https://www.docker.com/

Install an run hyper63 atlas micro

```sh
docker run -d -v data:/data -p 6363:6363 --name atlas hyper63/atlas:unstable
```

## Testing

```sh
yarn test:cache
```

## API

Create cache store

> Creating a cache store gives you a logical namespace to store data in for your cache,
> this request creates the store or returns and error if it already exists.

Request

```
PUT /micro/cache/:name
```

Successful Response

```json
{
  "ok": true
}
```

Already exists Error Response

```json
{
  "ok": false,
  "msg": "Store already exists"
}
```

General Error Response

```json
{
  "ok": false,
  "msg": "request error"
}
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

POST /micro/cache/:name/\_query?pattern=\*

```

List keys for a store

```

GET /micro/cache/:name

```

List keys by pattern

```

GET /micro/cache/:name?pattern=foo\* // all keys start with foo

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
