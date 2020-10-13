# Atlas

A microservice persistence layer, focused on providing a general abstraction layer for microservices and small applications to create products that are designed with quality attributes as a core decision factor. By creating a clear abstraction boundary between your business logic and your persistence layer, you are baking in flexibility into your microservice design.

Current Status: Organization and Design Phase

## Usage - (experimental mode only)

The current standalone usage is a bit cumbersome, but we will be working to improve this over time.

You will need to have Docker Desktop installed on your machine or docker and docker-compose

create a new directory:

```sh
mkdir atlas
cd atlas
```

create a `docker-compose.yml` file

```yaml
version: "3.8"
services:
  web:
    image: "hyper63/atlas:unstable"
    ports:
      - "6363:6363"
  redis:
    image: "redis:alpine"
    volumes:
      - ".:/data"
  couchdb:
    image: "couchdb"
    environment:
      COUCHDB_USER: "admin"
      COUCHDB_PASSWORD: "password"
    volumes:
      - ".:/opt/couchdb/data"
```

```sh
docker-compose up -d
docker exec -it atlas_couchdb_1 curl -X POST -H "Content-Type: application/json" localhost:5984/_cluster_setup -d '{"action":"enable_single_node", "bind_address":"0.0.0.0"}' -u 'admin:password'
```

## Developer Usage

Requirements

- Docker Desktop or (docker and docker-compose)
- NodeJS
- yarn (npm install -g yarn)

Once you have cloned the repository, you will want to create an `.env` file. This file will contain basic defaults for the data, cache, and storage services.

```
COUCHDB=http://admin:password@localhost:5984
REDIS=redis://localhost:6379
MINIO=http://minio:minio123@localhost:9000
```

Next you will run docker-compose in the project directory

> This will launch redis, couchdb, and minio for local use.

```sh
docker-compose up -d
```

Install dependencies

```sh
yarn
```

Start development server

```sh
yarn dev
```

## OpenAPI Specification

[View OpenAPI Spec](https://petstore.swagger.io/?url=https://gitcdn.xyz/repo/hyper63/atlas/main/swagger.yml)

## Inception Document

> An inception document is a 10 question document to describe the holistic view of the project initiative and create the high level why, what and how.

[Click Here](inception.md)

## Design Documents

> Works in progress

[Click Here](design.md)

## Contributing

Want to get involved read the following to find out how.

This is an opensource project, which welcomes all contributions and all development will occur in the open for interested parties to follow and comment. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) and the [Contributing](contributing.md) documentation to fully understand the requirements and restrictions to be a part of this community.
