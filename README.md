# hyper63

A service-framework that reduces redundant implementation code while maintaining full observabiliity for strong continuous delivery pipelines. hyper63 provides api abstractions to some of the core application building blocks. Using the ports and adapters architecture, hyper63's approach empowers you to use the service for each port you prefer.

Current Status: Development Phase

## OpenAPI Specification

[View OpenAPI Spec](https://openapi.hyper63.com)

## Local Usage

To serve hyper63 in your local environment in a terminal type:

```
npx @hyper63/nano
```

> This command will run a hyper63 service on PORT `6363` and store data in `/tmp/hyper63` > [Ctrl/Cmd] - C will stop the service.

This nano version of hyper63 implements the following ports and adapters:

- DATA - @hyper63/adapter-pouchdb
- CACHE - @hyper63/adapter-memory
- STORAGE - @hyper63/adapter-fs
- SEARCH - @hyper63/adapter-minisearch (in memory)

## Tour of hyper63 API

Using `Insomnia Core` application you can take a visual walkthrough of the hyper63 apis and get a feel for how each one of the apis is implemented.

[API Walkthrough](https://hyper63.com)

## hyper63/client

### NodeJS

We are working on a NodeJS hyper63/client, this client can be used in any NodeJS application:

```
import client from '@hyper63/client'
```

or

```
const client = require('@hyper63/client')
```

To find out more: [Click Here](https://hyper63.com)

## Developer Usage

```
yarn
cd images/dev
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
