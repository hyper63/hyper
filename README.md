# hyper63

A service gateway, focused on providing a generic interface for microservices and applications.

Current Status: Design and Development Phase

## OpenAPI Specification

[View OpenAPI Spec](https://petstore.swagger.io/?url=https://raw.githubusercontent.com/hyper63/hyper63/main/swagger.yml)

## Usage - (experimental mode only)

You will need to have Docker Desktop installed on your machine or docker and docker-compose

```sh
npx hyper63
```

To stop hyper63 services

```sh
npx hyper63 stop
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

Options to contribute:

- Write an adapter - create an adapter for a given port
- Write an client - create a client for your favorite language
- Write an app interface - create your own interface to the hyper63 service gateway
- Documentation - update the documentation to be concise and clear
- Examples - create an example implementation.

Want to get involved read the following to find out how.

This is an opensource project, which welcomes all contributions and all development will occur in the open for interested parties to follow and comment. Please read the [Code of Conduct](CODE_OF_CONDUCT.md) and the [Contributing](contributing.md) documentation to fully understand the requirements and restrictions to be a part of this community.

## Launcher

The launcher project creates a npm package that installs hyper63 on a local machine with adapter defaults of redis, couchdb, and minio.

## Middleware

With the express app, it is possible to include middleware to
include with the app, using the middleware property of the
config.js.

```
const memory = require('@hyper63/adapter-memory')
const pouchdb = require('@hyper63/adapter-pouchdb')
const jwt = require('./middleware/jwt')
const express = require('@hyper63/app-express')

module.exports = {
  app: express,
  adapters: [
    { port: 'cache', plugins: [memory()]},
    { port: 'data', plugins: [pouchdb({dir: process.env.DATA})]}
  ],
  middleware: [jwt]
}
```
