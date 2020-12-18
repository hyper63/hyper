# hyper63 PouchDB Adapter

hyper63 is a service framework that provides a common set of service commands for applications.

* data
* cache
* storage
* search

This adapter is for the data service, it uses pouchdb as the data service stores.

## How to configure

``` sh
npm install @hyper63/adapter-pouchdb
```

``` js
import pouchdb from '@hyper63/adapter-pouchdb'

export default {
  app: express,
  adapters: [
    ...
    { port: 'data', plugins: [pouchdb({dir: './data'})]}
  ]
}
```

## How to use

see https://purple-elephants.surge.sh

## Testing

``` sh
yarn test
```



