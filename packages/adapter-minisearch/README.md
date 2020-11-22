# MiniSearch Adapter

This adapter is for the search port, and it
implements and embedded search called
minisearch.

## How to use

See https://purple-elephants.surge.sh

## How to configure

```sh
npm install @hyper63/adapter-minisearch
```

```js
import minisearch from '@hyper63/adapter-minisearch'

export default {
  ...
  adapters: [
    ...
    { port: 'search', plugins: [minisearch()]}
  ]
}
```
