# hyper63 redis adapter

This adapter works for the 'cache' port.

## Install

```sh
npm install @hyper63/adapter-redis
```

## Environment Variables

```sh
REDIS_URL="https://redis:6379"
```

## Configuration

hyper63.config.js

```js
const redis = require('@hyper63/adapter-redis')

module.exports = {
  ...
  adapters: [
    {port: 'cache', plugins: [redis({url: process.env.REDIS_URL})]}
  ]
}
```
