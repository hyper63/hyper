const { Async } = require("crocks");

const prop = (key) => (obj) => obj[key];

const asyncify = (client, method) =>
  Async.fromPromise(client[method].bind(client));

module.exports = (client) => ({
  makeBucket: (name) =>
    asyncify(
      client,
      "makeBucket",
    )(name).map(() => ({
      ok: true,
    })).toPromise()
      .catch((err) => {
        return {
          ok: false,
          msg: err.code,
        };
      }),
  removeBucket: (name) =>
    asyncify(
      client,
      "removeBucket",
    )(name).map(() => ({
      ok: true,
    })).toPromise()
      .catch((err) => {
        return {
          ok: false,
          msg: err.code,
        };
      }),
  listBuckets: () =>
    asyncify(client, "listBuckets")().map((buckets) => ({
      ok: true,
      buckets: buckets.map(prop("name")),
    })).toPromise(),
  putObject: ({ bucket, object, stream }) =>
    asyncify(client, "putObject")(bucket, object, stream).map(() => ({
      ok: true,
    })).toPromise(),
  removeObject: ({ bucket, object }) =>
    asyncify(client, "removeObject")(bucket, object).map(() => ({
      ok: true,
    })).toPromise(),
  getObject: ({ bucket, object }) =>
    asyncify(client, "getObject")(bucket, object).toPromise(),
  listObjects: ({ bucket, prefix = "" }) =>
    Async.of(client.listObjects(bucket, prefix))
      .chain((s) => {
        return Async.fromPromise(
          () =>
            new Promise((resolve, reject) => {
              let objects = [];
              s.on("data", (obj) => (objects = [...objects, obj.name]));
              s.on("error", reject);
              s.on("end", () => resolve(objects));
            }),
        )();
      })
      .map((result) => {
        return {
          ok: true,
          objects: result,
        };
      }).toPromise(),
});
