import * as buckets from './buckets'
import * as objects from './objects'


export default ({ storage, events }) => {
  /**
   * @param {string} name
   * @returns {Async}
   */
  const makeBucket = (name) => buckets.make(name).runWith({ svc: storage, events });

  /**
   * @param {string} name
   * @returns {Async}
   */
  const removeBucket = (name) => buckets.remove(name).runWith({ svc: storage, events });

  /**
   * @param {string} name
   * @returns {Async}
   */
  const listBuckets = () => buckets.list().runWith({ svc: storage, events });

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @param {stream} stream
   * @returns {Async}
   */
  const putObject = (bucketName, objectName, stream) =>
    objects.put(bucketName, objectName, stream).runWith({ svc: storage, events });

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @returns {Async}
   */
  const getObject = (bucketName, objectName) =>
    objects.get(bucketName, objectName).runWith({ svc: storage, events });

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @returns {Async}
   */
  const removeObject = (bucketName, objectName) =>
    objects.remove(bucketName, objectName).runWith({ svc: storage, events });

  /**
   * @param {string} bucketName
   * @param {string} prefix
   * @returns {Async}
   */
  const listObjects = (bucketName, prefix) =>
    objects.list(bucketName, prefix).runWith({ svc: storage, events });

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
