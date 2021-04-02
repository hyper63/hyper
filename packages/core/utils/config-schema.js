const z = require('zod')

const F = z.function().args(z.any())


const plugin = z.object({
  id: z.string().optional(),
  port: z.string().optional(),
  load: z.function()
    .args(z.any().optional())
    .returns(z.any())  
    ,
  link: z.function()
    .args(z.any())
    .returns(z.function()
      .args(z.any())
      .returns(z.any())
    )
})

const Schema = z.object({
  app: F, 
  adapters: z.object({
    port: z.enum(['data', 'cache', 'search', 'storage', 'queue', 'hooks']),
    plugins: plugin.array()
  }).array(),
  middleware: F.array().optional()
})

module.exports = data => {

  return Schema.parse(data)
}
