# hyper63

A service gateway, focused on providing a generic interface for microservices and applications. 

Current Status: Design and Development Phase

## OpenAPI Specification

[View OpenAPI Spec](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/hyper63/atlas/main/swagger.yml)

## Usage - (experimental mode only)

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
    environment:
      REDIS: redis://redis:6379
      COUCH: http://admin:password@couchdb:5984
      MINIO: http://minio:minio123@minio:9000
    ports:
      - "6363:6363"
    depends_on:
      - redis
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
  minio:
      image: minio/minio
      environment:
        MINIO_ACCESS_KEY: minio
        MINIO_SECRET_KEY: minio123
      volumes:
        - "./data:/data"
      ports:
        - "9000:9000"
      command: server /data

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


## Inception Document

> An inception document is a 10 question document to describe the holistic view of the project initiative and create the high level why, what and how.

[Click Here](inception.md)

## Design Documents

> Works in progress

[Click Here](design.md)

## Contributing

Want to get involved read the following to find out how.

This is an opensource project, which welcomes all contributions and all development will occur in the open for interested parties to follow and comment. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) and the [Contributing](contributing.md) documentation to fully understand the requirements and restrictions to be a part of this community.
