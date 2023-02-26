import { port } from './port.ts'

export function hooks(adapter: unknown) {
  const instance = port.parse(adapter)

  // TODO: wrap all methods with validation methods
  return instance
}
