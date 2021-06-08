const test = require('tape')
const RedisCacheAdapter = require('./index')
const z = require('zod')

const schema = z.object({
  id: z.string().optional(),
  port: z.string().optional(),
  load: z.function()
    .args(z.any().optional())
    .returns(z.any()),
  link: z.function()
    .args(z.any())
    .returns(z.function()
      .args(z.any())
      .returns(z.any())
    )
})

test('validate schema', t => {
  t.ok(schema.safeParse(RedisCacheAdapter()).success)
  t.end()
})
