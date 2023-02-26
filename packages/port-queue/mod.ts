import { port, type QueuePort } from './port.ts'

export type { QueuePort }

export function queue(adapter: unknown) {
  const instance = port.parse(adapter)

  instance.index = port.shape.index.implement(instance.index)
  instance.create = port.shape.create.implement(instance.create)
  instance.post = port.shape.post.implement(instance.post)
  instance.delete = port.shape.delete.implement(instance.delete)
  instance.get = port.shape.get.implement(instance.get)
  instance.retry = port.shape.retry.implement(instance.retry)
  instance.cancel = port.shape.cancel.implement(instance.cancel)

  return instance
}
