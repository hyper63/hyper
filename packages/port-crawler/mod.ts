import { type CrawlerPort, port as Port } from './port.ts'

export type { CrawlerPort }

export function crawler(adapter: unknown) {
  const instance = Port.parse(adapter)

  instance.upsert = Port.shape.upsert.implement(instance.upsert)
  instance.get = Port.shape.get.implement(instance.get)
  instance.start = Port.shape.start.implement(instance.start)
  instance.delete = Port.shape.delete.implement(instance.delete)

  return instance
}
