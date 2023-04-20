import type { StoragePort } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import { $logHyperErr, $resolveHyperErr, Async, AsyncReader, triggerEvent } from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

/**
 * @param bucket
 * @param object
 * @param stream
 * @param useSignedUrl
 */
export const put = (
  bucket: string,
  object: string,
  stream: ReadableStream | void,
  useSignedUrl: boolean | undefined,
) =>
  of({
    bucket,
    object,
    stream,
    useSignedUrl,
  })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<StoragePort>) => {
        return (
          Async.of(input)
            // deno-lint-ignore ban-ts-comment
            // @ts-ignore
            .chain(Async.fromPromise((input) => svc.putObject(input)))
            .bichain($resolveHyperErr, $logHyperErr)
        )
      }).chain(lift)
    )
    .chain(triggerEvent('STORAGE:PUT'))

/**
 * @param bucket
 * @param object
 * @param useSignedUrl
 */
export const get = (bucket: string, object: string, useSignedUrl: boolean) =>
  of({
    bucket,
    object,
    useSignedUrl,
  })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<StoragePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.getObject(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('STORAGE:GET'))

/**
 * @param bucket
 * @param object
 */
export const remove = (bucket: string, object: string) =>
  of({
    bucket,
    object,
  })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<StoragePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.removeObject(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('STORAGE:DELETE'))

/**
 * @param bucket
 * @param prefix
 */
export const list = (bucket: string, prefix: string) =>
  of({
    bucket,
    prefix,
  })
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<StoragePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.listObjects(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('STORAGE:LIST'))
