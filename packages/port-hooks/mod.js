import { z } from "./deps.js";

export function hooks(adapter, env) {
  const Port = z.object({
    // add port methods
  });

  const instance = Port.parse(adapter(env));
  // TODO: wrap all methods with validation methods
  return instance;
}
