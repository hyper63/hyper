import { type QueuePort, R } from '../../deps.ts'
import type { ReaderEnvironment } from '../../types.ts'

import {
  $logHyperErr,
  $resolveHyperErr,
  Async,
  AsyncReader,
  is,
  triggerEvent,
} from '../utils/mod.ts'

const { ask, of, lift } = AsyncReader

const { toLower, lensProp, over } = R

function checkNameIsValid<T extends { name: string }>(input: T) {
  return is<T>(({ name }) => {
    /**
     * rules:
     * must be a combination of:
     * lowercase letters
     * digits 0-9
     * or any of these characters - _ ~
     */
    return /^[a-z0-9-~_]+$/.test(name)
  }, { status: 422, msg: 'queue name is not valid!' })(input)
}

export const index = () =>
  ask(({ svc }: ReaderEnvironment<QueuePort>) => {
    return Async.of(undefined)
      .chain(Async.fromPromise((input) => svc.index(input)))
      .bichain($resolveHyperErr, $logHyperErr)
  })
    .chain(lift)
    .chain(triggerEvent('QUEUE:INDEX'))

export const create = (input: Parameters<QueuePort['create']>[0]) =>
  of(input)
    .map(over(lensProp('name'), toLower))
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<QueuePort>) => {
        return Async.of(input)
          .chain(checkNameIsValid)
          .chain(Async.fromPromise((input) => svc.create(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('QUEUE:CREATE'))

export const del = (name: string) =>
  of(name)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<QueuePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.delete(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('QUEUE:DELETE'))

export const list = (input: Parameters<QueuePort['get']>[0]) =>
  of(input)
    .chain((input) =>
      ask(({ svc }: ReaderEnvironment<QueuePort>) => {
        return Async.of(input)
          .chain(Async.fromPromise((input) => svc.get(input)))
          .bichain($resolveHyperErr, $logHyperErr)
      }).chain(lift)
    )
    .chain(triggerEvent('QUEUE:LIST'))
