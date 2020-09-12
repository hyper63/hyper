# hubble-micro

A backend as a service for micro-services

With a micro-service architecture a basic principle is that each service 
manages its own data. Two micro-services should not share a data store. 
Instead each service is responsible for its own private data store,
which others cannot access directly.

hubble is a backend as a service solution that encourages separation between
common services and business logic of your application. This separation is
a function of a domain centric architecture or clean architecture. As products
grow in complexity over time with strong pressure to ship features in a time
sensitive way, the likely hood that business rules get spread between 
architectural layers is extremely likely. 

> Hubble's goal is to encourage business rules to settle in a core area leveraging solid principles to keep the business logic highly maintainable as the product grows over time.

This product takes the concepts of hubble and applys them to a micro-service, with 
a micro-service you will have the following layers:

* interface/api
* business rules
* services

What hubble-micro wants to do is to generalize the services your micro-service may need 
so that you can keep your business rules cleanly separated as well as leveraging the ports
and adapter design so that your backend services can be replacable without having to modify
business rules. hubble-micro is a docker container that gives you data, cache, files and notifications out of the box, without having to make any decisions, you simply `docker run` and you have your backend end service up and running!

[Inception Deck](inception.md)

## Usage

> Docker is required 

``` sh
docker run -it -p 8443:8443 -p 9090:9090 -v hubble:/var/hubble --name hubble hyper63/hubble-micro:lts
```

## API

Currently, the services for micro are 

* data - structured data storage
* cache - temporal storage
* buckets/files - unstructured data storage
* notifications/hooks - system event notifications

### Basic API patterns

All apis use this basic pattern:

> designing the api to support multiple services currenlty only supporting data, cache, files, hooks.

```
/micro/services/:name
```

For example, if you want to access the data service:

```
GET /micro/services/data
```

and if you want to access the cache service:

```
GET /micro/services/cache
```

All commands will start with an underscore

> Commands are built in urls that instruct the system to perform an action usually with a POST, PUT or DELETE method.

queries a customer data store

Example Request:

```
POST /micro/services/data/customers/_query HTTP/1.1
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
GET /micro/services/_list HTTP/1.1
HOST: localhost:6030
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
  "buckets",
  "hooks"
]
```

### Data API

list data stores

```
GET /micro/services/data/_list
```

create a new data store

```
PUT /micro/services/data/:name
```

remove data store

```
DELETE /micro/services/data/:name
```

list documents from data store

> query parameters: (limit, start, end, keys)

```
GET /micro/services/data/:name/_list
```

create new document

```
POST /micro/services/data/:name
```

get document

```
GET /micro/services/data/:name/:id
```

update document

```
PUT /micro/services/data/:name/:id
```

patch document

```
PATCH /micro/services/data/:name/:id
```

query documents

```
POST /micro/services/data/:name/_query
```

create a query index

```
POST /micro/services/data/:name/_index
```

### Cache API

list stores

```
GET /micro/services/cache/_list
```

create store

```
PUT /micro/services/cache/:name
```

remove store

```
DELETE /micro/services/cache/:name
```

list cache documents

> query params - (limit, start, keys, sort)

```
GET /micro/services/cache/_list
```

create/update cache doc

> query params (ttl - time to live)

```
PUT /micro/services/cache/:name/:key
```

remove cache doc

```
DELETE /micro/services/cache/:name/:key
```

### Bucket API

list buckets

```
GET /micro/services/buckets/_list
```

create bucket

```
PUT /micro/services/buckets/:name
```

get bucket info

```
GET /micro/services/buckets/:name
```

remove bucket

```
DELETE /micro/services/buckets/:name
```

list files in bucket

```
GET /micro/services/buckets/:name/_list
```

put file

```
PUT /micro/services/buckets/:name/:id
```

get file

```
GET /micro/services/buckets/:name/:id
```

remove file

```
DELETE /micro/services/buckets/:name/:id
```

### Notifications API (hooks)

The notification api is an api that can notify subscribers when a hubble service 
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
GET /micro/services/hooks/_list
```

register hook

```
PUT /micro/services/hooks/:name
```

unregister hook

```
DELETE /micro/services/hooks/:name
```

get hook info

> returns hook document

```
GET /micro/services/hooks/:name
```

> One note, the `micro` prefix in the url is a `tenant`, since the micro version of hubble is 
single tenant it is defaulted to `micro`, but in future planned products, like `hubble-cloud` the schema will be identical, but the `micro` would be replaced by the tenant name.

