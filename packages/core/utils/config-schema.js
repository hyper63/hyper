import { z } from '../deps.js';

const F = z.function().args(z.any());

const plugin = z.object({
  id: z.string().optional(),
  port: z.string().optional(),
  load: z.function()
    .args(z.any().optional())
    .returns(z.any()),
  link: z.function()
    .args(z.any())
    .returns(
      z.function()
        .args(z.any())
        .returns(z.any()),
    ).optional(),
});

const Schema = z.object({
  app: F,
  adapters: z.object({
    port: z.enum([
      'data',
      'cache',
      'search',
      'storage',
      'queue',
      'hooks',
      'crawler',
    ]),
    plugins: plugin.array(),
  }).array(),
  middleware: F.array().optional(),
});

export default function (data) {
  return Schema.parse(data);
}
