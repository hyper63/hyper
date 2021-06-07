const z = require('zod')
/**
 * @param {object} plugin
 * @returns {object}
 */
module.exports = function (plugin) {
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

  const instance = schema.parse(plugin)
  instance.load = schema.shape.load.validate(plugin.load)
  instance.link = schema.shape.link.validate(plugin.link)

  return instance
}
