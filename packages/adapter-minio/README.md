# hyper63 MINIO Adapter

MinIO is a storage service that allows you to create
buckets and upload objects, like files, and media to
a storage solution.

## Install

```sh
npm install @hyper63/adapter-minio
```

## Configuration

```js
const minio = require("@hyper63/adapter-minio");

module.exports = {
  adapter: [
    {
      port: "storage",
      plugins: [minio({ url: "http://[user]:[password]/minio:9000" })],
    },
  ],
};
```
