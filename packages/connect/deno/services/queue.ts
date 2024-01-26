import { HyperRequestFunction, Method, QueueStatus } from '../types.ts'

const service = 'queue' as const

export const enqueue = (body: unknown) => (h: HyperRequestFunction) =>
  h({ service, method: Method.POST, body })

export const errors = () => (h: HyperRequestFunction) =>
  h({ service, method: Method.GET, params: { status: QueueStatus.ERROR } })

export const queued = () => (h: HyperRequestFunction) =>
  h({ service, method: Method.GET, params: { status: QueueStatus.READY } })

export const create = (target: string, secret?: string) => (hyper: HyperRequestFunction) =>
  hyper({ service, method: Method.PUT, body: { target, secret } })

export const destroy = (confirm?: boolean) => (hyper: HyperRequestFunction) =>
  confirm
    ? hyper({ service, method: Method.DELETE })
    : Promise.reject({ ok: false, msg: 'request not confirmed!' })
