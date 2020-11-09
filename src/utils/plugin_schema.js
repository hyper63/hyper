import * as z from 'zod'

export default function(plugin) {
  const schema = z.object({
    id: z.string().optional(),
    port: z.string().optional(),
    load: z.function().optional(),
    link: z.function().optional()
  })

  return schema.safeParse(plugin)
}