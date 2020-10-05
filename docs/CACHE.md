# Atlas Cache Documentation

## Summary

The atlas cache api allows the application to create cache stores and read/write json documents to those stores by providing a key for each json document and an optional ttl or time to live period for the cached document. A cache can be very useful to provide fast access to specific data if the data has not changed recently. Leveraging a cache can provide a significant boost in terms of scale and performance for an application.

## Usage

``` sh
docker run ...
```

## Testing

``` sh
yarn test:cache
```

## Requirements

To create a cache api, I need to be able to 

* create a cache store 
* add a key and value to a cache store, with a TTL option
* get a value from a key
* update a value to a key resetting TTL
* remove a key value pair
* get a specific list of values by their keys
* get a set of keys by range searches of partial key values

All keys must be strings - with no spaces, no slashes, and uri safe
All values must be valid json


## API

Create cache store

```
PUT /cache/:name
```

Delete cache store

```
DELETE /cache/:name
```

Add key/value to cache

```
POST /cache/:name
content-type: application/json

{
  "key": "KEY",
  "value": {"HELLO": "WORLD"}
  "ttl": "1 hr"
}
```

Get a value from key

```
GET /cache/:name/:key
```

Update a value for a key

```
PUT /cache/:name/:key

{
  "HELLO": "MARS"
}
```

Delete a key

```
DELETE /cache/:name/:key
```

List keys

```
GET /cache/:name?keys=["1", "2", "3"]
```

List a range of keys

```
GET /cache/:name?start="1"&end="3"
```


