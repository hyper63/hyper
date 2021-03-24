# hyper63 adapter for couchdb

This hyper63 image uses the `app-express` module and the `adapter-couchdb` module to instanciate an instance of hyper63 with only the data port. This
image secures the hyper63 instance using jwt middleware that supports a
shared secret.

## Setup

This service depends on two environment variables:

- SECRET {string} - this is the secret used to verify a signed JWT token
- COUCHDB_SERVER {url} - this is a full url used to connect to your couchdb server, it should have a key and secret which gives hyper63 full control of your
  server. ex. 'https://[key]:[secret]@[host]:[port]'

> Need to install a couchdb server? see [Create CouchDB Server](https://blog.hyper63.com/setup-couchdb)

## Run locally

Read this step by step post on how to setup this image locally.

## Run as nodejs app

## Build Docker Container

## Run docker container

```sh
docker pull hyper63/couchdb-svc
docker run -d --name hyper63 \
--log-opt max-size=100m \
--restart always \
-e SECRET='your secret' \
-e COUCHDB_SERVER='couchdb server url' \
hyper63/couchdb-svc
```
