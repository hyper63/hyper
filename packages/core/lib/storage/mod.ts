import type { StoragePort } from '../../deps.ts'
import type { EventsManager } from '../../types.ts'

import * as buckets from './buckets.ts'
import * as objects from './objects.ts'

export default function ({
  storage,
  events,
}: {
  storage: StoragePort
  events: EventsManager
}) {
  /**
   * @param {string} name
   */
  const listBuckets = () => buckets.list().runWith({ svc: storage, events })

  /**
   * @param {string} name
   */
  const makeBucket = (name: string) => buckets.make(name).runWith({ svc: storage, events })

  /**
   * @param {string} name
   */
  const removeBucket = (name: string) => buckets.remove(name).runWith({ svc: storage, events })

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @param {stream} stream
   * @param {boolean} useSignedUrl
   */
  const putObject = (
    bucketName: string,
    objectName: string,
    stream: ReadableStream | void | undefined,
    useSignedUrl: boolean,
  ) =>
    objects.put(bucketName, objectName, stream, useSignedUrl).runWith({
      svc: storage,
      events,
    })

  /**
   * @param {string} bucketName
   * @param {string} objectName
   * @param {boolean} useSignedUrl
   */
  const getObject = (
    bucketName: string,
    objectName: string,
    useSignedUrl: boolean,
  ) =>
    objects.get(bucketName, objectName, useSignedUrl).runWith({
      svc: storage,
      events,
    })

  /**
   * @param {string} bucketName
   * @param {string} objectName
   */
  const removeObject = (bucketName: string, objectName: string) =>
    objects.remove(bucketName, objectName).runWith({ svc: storage, events })

  /**
   * @param {string} bucketName
   * @param {string} prefix
   */
  const listObjects = (bucketName: string, prefix: string) =>
    objects.list(bucketName, prefix).runWith({ svc: storage, events })

  return Object.freeze({
    makeBucket,
    removeBucket,
    listBuckets,
    putObject,
    getObject,
    listObjects,
    removeObject,
  })
}
