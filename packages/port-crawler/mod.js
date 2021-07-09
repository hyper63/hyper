import { z } from "./deps.js";

const Port = z.object({});

export function crawler(adapter) {
  const instance = Port.parse(adapter);

  return instance;
}
