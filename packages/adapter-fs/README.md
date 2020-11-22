# hyper63 file storage adapter

This adapter uses the file system to store unstructured objects
in the hyper63 service framework.

## How to configure

``` sh
npm install @hyper63/adapter-fs
```

In config

``` js
import fs from '@hyper63/adapter-fs'

export default {
  app: express,
  adapters: [
    ...
    { port: 'storage', plugins: [fs({dir: './data'})]}
  ]
}
```

## How to use

https://purple-elephants.surge.sh

## Testing

## License

Apache-2.0

## More information

https://github.com/hyper63/hyper63#readme
