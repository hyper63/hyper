# hyper63 memory adapter

The memory adapter is an adapter for the `CACHE` port in the
hyper63 gateway.

## How to use

In your hyper63 project, install the adapter:

```sh
yarn add @hyper63/adapter-memory
```

In your `hyper63.config.js` file, import the module.

```js
import { default as memory } from "@hyper63/adapter-memory";
```

In the adapters section, add the memory adapter as a plugin:

```js
export default {
  ...
  adapters: {
    ...
    { port: 'cache', plugins: [memory()]}
  }
}
```

## How to test

```sh
yarn test
```

## More information

https://github.com/hyper63/hyper63
