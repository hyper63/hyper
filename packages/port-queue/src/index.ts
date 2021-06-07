/* eslint-disable no-redeclare */

import { z } from 'zod'

const QueueListResponse = z.string().array()

const QueueCreateInput = z.object({
  name: z.string(),
  target: z.string().url(),
  secret: z.string().max(100).optional()
})

const QueueResponse = z.object({
  ok: z.boolean(),
  msg: z.string().optional(),
  status: z.number().optional()
})

const QueuePostInput = z.object({
  name: z.string(),
  job: z.object({}).passthrough()
})

const QueueGetInput = z.object({
  name: z.string(),
  status: z.enum(['READY', 'ERROR'])
})

const JobsResponse = z.object({
  ok: z.boolean(),
  jobs: z.array(z.object({}).passthrough()).optional(),
  status: z.number().optional()
})

const JobInput = z.object({
  name: z.string(),
  id: z.string()
})

const QueuePort = z.object({
  index: z.function()
    .args()
    .returns(z.promise(QueueListResponse)),
  create: z.function()
    .args(QueueCreateInput)
    .returns(z.promise(QueueResponse)),
  delete: z.function()
    .args(z.string())
    .returns(z.promise(QueueResponse)),
  post: z.function()
    .args(QueuePostInput)
    .returns(z.promise(QueueResponse)),
  get: z.function()
    .args(QueueGetInput)
    .returns(z.promise(JobsResponse)),
  retry: z.function()
    .args(JobInput)
    .returns(z.promise(QueueResponse)),
  cancel: z.function()
    .args(JobInput)
    .returns(z.promise(QueueResponse))
})

export type QueuePort = z.infer<typeof QueuePort>
export type QueueListResponse = z.infer<typeof QueueListResponse>
export type QueueCreateInput = z.infer<typeof QueueCreateInput>
export type QueueResponse = z.infer<typeof QueueResponse>
export type QueuePostInput = z.infer<typeof QueuePostInput>
export type QueueGetInput = z.infer<typeof QueueGetInput>
export type JobsResponse = z.infer<typeof JobsResponse>
export type JobInput = z.infer<typeof JobInput>

export default function (adapter : QueuePort) : QueuePort {
  const instance = QueuePort.parse(adapter)

  // wrap the functions with validators
  instance.create = QueuePort.shape.create.validate(instance.create)
  instance.post = QueuePort.shape.post.validate(instance.post)
  instance.delete = QueuePort.shape.delete.validate(instance.delete)
  instance.get = QueuePort.shape.get.validate(instance.get)
  instance.retry = QueuePort.shape.retry.validate(instance.retry)
  instance.cancel = QueuePort.shape.cancel.validate(instance.cancel)

  return instance
}
