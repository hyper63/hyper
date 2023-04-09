import { z } from './deps.ts'

/**
 * An event emitted from core,
 * as a result of a hyper service call
 */
export const eventSchema = z.object({
  type: z.string(),
  payload: z.record(z.unknown()),
})
export type Event = z.infer<typeof eventSchema>

/**
 * A subscription to events emitted from core,
 * as a result of a hyper service call
 */
export const eventSubscriptionSchema = z.function().args(eventSchema)
export type EventSubscription = z.infer<typeof eventSubscriptionSchema>

/**
 * A hyper service Adapter plugin.
 *
 * The plugin will be used by core to bootstrap hyper services
 */
export const adapterPluginSchema = z.object({
  id: z.string().optional(),
  port: z.string().optional(),
  load: z.function().args(z.any().optional()).returns(z.any()),
  link: z
    .function()
    .args(z.any())
    .returns(z.function().args(z.any()).returns(z.any()))
    .optional(),
})
export type AdapterPlugin = z.infer<typeof adapterPluginSchema>

/**
 * An object that describes a raw hyper service implementation
 * consisting of the port name, and the array of plugins to be composed
 * into a hyper service
 */
export const adapterNodeSchema = z.object({
  port: z.enum([
    'data',
    'cache',
    'search',
    'storage',
    'queue',
    'hooks',
    'crawler',
  ]),
  plugins: z.array(adapterPluginSchema),
})
export type AdapterNode = z.infer<typeof adapterNodeSchema>

/**
 * A hyper server configuration.
 *
 * Every hyper server consists of:
 * - A driving adapter: 'app'
 * - A map of hyper service adapters, each containing
 *  - the hyper service port being implemented: 'port'
 *  - An array of plugins that composed to implement the hyper service port: 'plugins'
 * - An array of middleware to further augment the driving adapter,
 * for example to add AuthN/Z or monitoring of the driving adapter
 */
export const configSchema = z.object({
  app: z.function().args(z.any()).returns(z.any()),
  adapters: adapterNodeSchema.array(),
  middleware: z
    .array(z.function().args(z.any()).returns(z.any()))
    .optional()
    .default([]),
})
export type Config = z.infer<typeof configSchema>
