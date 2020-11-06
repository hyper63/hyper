import * as z from 'zod'

export default function (adapter, env) {
  const Port = z.object({
    // add port methods
  })

  const instance = Port.parse(adapter(env))
  //TODO: wrap all methods with validation methods
  return instance
}