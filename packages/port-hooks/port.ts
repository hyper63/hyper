import { z } from 'zod'

export const port = z.object({
  // TODO: add port methods
}).passthrough()

export type HooksPort = z.infer<typeof port>
