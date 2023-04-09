import { configSchema } from '../model.ts'

export default function (config: unknown) {
  return configSchema.parse(config)
}
