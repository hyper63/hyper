import { z } from './deps.ts'

export const port = z.object({
  // TODO: add port methods
})

export type HooksPort = z.infer<typeof port>
