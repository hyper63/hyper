import { opine, spider } from './deps.js';

const spiderUrl = Deno.env.get('SPIDER_URL');

export default {
  app: opine,
  adapters: [
    {
      port: 'crawler',
      plugins: [spider({
        links: spiderUrl,
        content: spiderUrl,
      })],
    },
  ],
};
