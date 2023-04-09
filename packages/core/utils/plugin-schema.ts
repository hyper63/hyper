import { adapterPluginSchema } from '../model.ts'

/**
 * TODO: Remove. Unused in core, but imported by
 * adapter tests.
 *
 * Instead should import adatperPlugin from models.ts
 */
export default function (plugin: unknown) {
  const instance = adapterPluginSchema.parse(plugin)
  return instance
}
