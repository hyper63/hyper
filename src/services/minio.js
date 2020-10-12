const Async = require("crocks/Async");
const Minio = require("minio");

const prop = (key) => (obj) => obj[key];

const asyncify = (client, method) =>
  Async.fromPromise(client[method].bind(client));
/**
 * @param {string} name
 * @returns {Async}
 */
const makeBucket = (client) => (name) =>
  asyncify(
    client,
    "makeBucket"
  )(name).map(() => ({
    ok: true,
  }));

/**
 * @param {string} name
 * @returns {Async}
 */
const removeBucket = (client) => (name) =>
  asyncify(
    client,
    "removeBucket"
  )(name).map(() => ({
    ok: true,
  }));

/**
 * @returns {Async}
 */
const listBuckets = (client) => () =>
  asyncify(client, "listBuckets")().map((buckets) => ({
    ok: true,
    buckets: buckets.map(prop("name")),
  }));

/**
 * @param {string} bucketName
 * @param {string} objectName
 * @param {Stream} stream
 * @returns {Async}
 */
const putObject = (client) => (bucketName, objectName, stream) =>
  asyncify(client, "putObject")(bucketName, objectName, stream).map(
    (result) => {
      console.log(result);
      return { ok: true };
    }
  );
/**
 * @param {string} bucketName
 * @param {string} objectName
 * @returns {Async}
 */
const removeObject = (client) => (bucketName, objectName) =>
  asyncify(client, "removeObject")(bucketName, objectName).map((result) => {
    console.log(result);
    return { ok: true };
  });

/**
 * @param {string} bucketName
 * @param {string} objectName
 * @returns {Async}
 */
const getObject = (client) => (bucketName, objectName) =>
  asyncify(client, "getObject")(bucketName, objectName);

/**
 * @param {string} bucketName
 * @param {string} prefix
 * @returns {Async}
 */
const listObjects = (client) => (bucketName, prefix = "") =>
  Async.of(client.listObjects(bucketName, prefix))
    .chain((s) => {
      return Async.fromPromise(
        () =>
          new Promise((resolve, reject) => {
            let objects = [];
            s.on("data", (obj) => (objects = [...objects, obj.name]));
            s.on("error", reject);
            s.on("end", () => resolve(objects));
          })
      )();
    })
    .map((result) => {
      return {
        ok: true,
        objects: result,
      };
    });

module.exports = (config) => {
  const client = new Minio.Client(config);
  return Object.freeze({
    makeBucket: makeBucket(client),
    removeBucket: removeBucket(client),
    listBuckets: listBuckets(client),
    putObject: putObject(client),
    removeObject: removeObject(client),
    getObject: getObject(client),
    listObjects: listObjects(client),
    /*
    listIncompleteUploads,
    copyObject,
    */
  });
};
