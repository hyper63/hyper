import { z } from 'zod'
import { QueuePort } from '@hyper63/port-queue'

const Config = z.object({
  redis: z.string().url()
}).passthrough()


export type Config = z.infer<typeof Config>
export type AdapterFn = () => QueuePort | undefined
