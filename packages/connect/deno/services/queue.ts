import { HyperRequestFunction, Method, QueueStatus } from '../types.ts'

const service = 'queue' as const

export const enqueue = (body: unknown) => (h: HyperRequestFunction) =>
  h({ service, method: Method.POST, body })

export const errors = () => (h: HyperRequestFunction) =>
  h({ service, method: Method.GET, params: { status: QueueStatus.ERROR } })

export const queued = () => (h: HyperRequestFunction) =>
  h({ service, method: Method.GET, params: { status: QueueStatus.READY } })
