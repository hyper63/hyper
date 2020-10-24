# hyper63 Design Document

A service gateway for creating future proof applications.

hyper63 is a service gateway that encourages separation between
common services and business logic of your application. This separation is
a function of a clean architecture leveraging the ports and adapters pattern.
As products grow in complexity over time with strong pressure to ship features
in a time sensitive way, the likely hood that business rules get spread between
architectural layers is extremely likely.

> hyper63's goal is to encourage business rules to settle in a core area leveraging solid principles to keep the business logic highly maintainable as the product grows over time.

- interface/api
- business rules
- services

What hyper63 wants to do is to generalize the services your application may need
so that you can keep your business rules cleanly separated as well as leveraging the ports
and adapter design so that your backend services can be replacable without having to modify
business rules. hyper63 is a docker container that gives you data, cache, storage, search and webhooks out of the box, without having to make any decisions, you simply `docker-compose up` and you have your backend end service up and running!

[Inception Deck](inception.md)

## Usage

> Docker is required

```sh
docker run -it -p 8443:8443 -p 9090:9090 -v atlas:/var/atlas --name atlas hyper63/atlas:lts
```

## API

Currently, the services for micro are

- data - structured data storage
- cache - temporal storage
- storage - unstructured data storage
- search - text based search
- hooks - system event notifications

### Basic API patterns

All apis use this basic pattern:

> designing the api to support multiple services currenlty only supporting data, cache, storage, search, hooks.

```
/:service/:name
```

For example, if you want to access the data service:

```
GET /data/products
```

and if you want to access the cache service:

```
GET /cache/products
```

All commands will start with an underscore

> Commands are built in urls that instruct the system to perform an action usually with a POST, PUT or DELETE method.

queries a customer data store

Example Request:

```
POST /data/customers/_query HTTP/1.1
Accept: application/json
Content-Type: application/json
Content-Length: XXX
Host: localhost:6030

{
  "selector": {
    "active": true
  },
  "fields": ["_id","name", "email"],
  "sort": [{"added": "asc"}],
  "limit": 2,
  "skip": 0,
  "execution_stats": false
}
```

Example Response:

```
HTTP/1.1 200 OK
Cache-Control: must-revalidate
Content-Type: application/json
Date: Sat, 12 Sep 2020 14:53:41 GMT
Server: Hubble (micro)
Transfer-Encoding: chunked

{
  "docs": [
    {
      "_id": "1234",
      "name": "John Smith",
      "email": "john@smith.com"
    },
    {
      "_id": "4321",
      "name": "Mark Wall",
      "email": "mark@wall.com"
    }
  ]
}
```

list all services

Example Request:

```
GET /_list HTTP/1.1
HOST: localhost:6363
Accept: */*
```

Example Response:

```
HTTP/1.1 200 OK
Cache-Control: must-revalidate
Content-Type: application/json
Date: Sat, 12 Sep 2020 14:53:41 GMT
Server: Hubble (micro)
Transfer-Encoding: chunked

[
  "data",
  "cache",
  "storage",
  "search",
  "hooks"
]
```

### Data API

list data stores

```
GET /data/_list
```

create a new data store

```
PUT /data/:name
```

remove data store

```
DELETE /data/:name
```

list documents from data store

> query parameters: (limit, start, end, keys)

```
GET /data/:name/_list
```

create new document

```
POST /data/:name
```

get document

```
GET /data/:name/:id
```

update document

```
PUT /data/:name/:id
```

patch document

```
PATCH /data/:name/:id
```

query documents

```
POST /data/:name/_query
```

create a query index

```
POST /data/:name/_index
```

### Cache API

list stores

```
GET /cache/_list
```

create store

```
PUT /cache/:name
```

remove store

```
DELETE /cache/:name
```

list cache documents

> query params - (limit, start, keys, sort)

```
GET /cache/_list
```

create/update cache doc

> query params (ttl - time to live)

```
PUT /cache/:name/:key
```

remove cache doc

```
DELETE /cache/:name/:key
```

### Bucket API

list buckets

```
GET /storage/_list
```

create bucket

```
PUT /storage/:name
```

get bucket info

```
GET /storage/:name
```

remove bucket

```
DELETE /storage/:name
```

list files in bucket

```
GET /storage/:name/_list
```

put file

```
PUT /storage/:name/:id
```

get file

```
GET /storage/:name/:id
```

remove file

```
DELETE /storage/:name/:id
```

### Notifications API (hooks)

The notification api is an api that can notify subscribers when a atlas service
event was triggered, using a registered endpoint.

Each hook will require a scope of what the hook wants to watch, examples

```
*.*.* - all services, all stores, all actions

data.widgets.read - only when read events are done for the widgets data store
cache.cogs.write - when writes occur for the cogs cache
buckets.*.delete - when any deletion occurs for a file

So the scope pattern would :service.:name.:action - asterisk equals all and
actions are (read,write,delete)

```

list hooks

```
GET /hooks/_list
```

register hook

```
PUT /hooks/:name
```

unregister hook

```
DELETE /hooks/:name
```

get hook info

> returns hook document

```
GET /hooks/:name
```
