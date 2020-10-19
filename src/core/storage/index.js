const buckets = require("./buckets");
const objects = require("./objects");

module.exports = ({ storage }) => {
  /**
   * @param {string} name
   * @returns {Async}
   */
  const makeBucket = (name) => buckets.make(name).runWith(storage);

  /**
   * @param {string} name
   * @returns {Async}
   */
  const removeBucket = (name) => buckets.remove(name).runWith(storage);

  /**
   * @param {string} name
   * @returns {Async}
   */
  const listBuckets = () => buckets.list().runWith(storage);

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @param {stream} stream
   * @returns {Async}
   */
  const putObject = (bucketName, objectName, stream) =>
    objects.put(bucketName, objectName, stream).runWith(storage);

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @returns {Async}
   */
  const getObject = (bucketName, objectName) =>
    objects.get(bucketName, objectName).runWith(storage);

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @returns {Async}
   */
  const removeObject = (bucketName, objectName) =>
    objects.remove(bucketName, objectName).runWith(storage);

  /**
   * @param {string} bucketName
   * @param {string} prefix
   * @returns {Async}
   */
  const listObjects = (bucketName, prefix) =>
    objects.list(bucketName, prefix).runWith(storage);

  return Object.freeze({
    makeBucket,
    removeBucket,
    listBuckets,
    putObject,
    getObject,
    listObjects,
    removeObject,
  });
};
