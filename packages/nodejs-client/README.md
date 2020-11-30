# hyper63 client

## Install

```
npm install @hyper63/client
```

## Usage

``` js
const createClient = require('@hyper63/client')
const client = createClient(host, key, secret, app)

client.data.createDatabase('foo')
  .chain(() => client.data.create({ hello: 'world'}))
  .fork(
    console.log.bind(console),
    console.log.bind(console)
  )
```

