// deno-lint-ignore-file no-unused-vars

import { crawler as crawlerPort } from './mod.js';
import { assert, equal } from './dev_deps.js';

const test = Deno.test;
const crawlerJob = {
  app: 'app',
  name: 'name',
  source: 'https://example.com',
  script: '',
  depth: 1,
  target: {
    url: 'https://target.com',
    secret: 'secret',
    sub: 'sub',
  },
  notify: 'https://notify.com',
};

const adapter = {
  upsert: (o) => Promise.resolve({ ok: true }),
  get: (o) =>
    Promise.resolve({
      id: 'app-name',
      ...crawlerJob,
    }),
  start: (o) => Promise.resolve({ ok: true }),
  delete: (o) => Promise.resolve({ ok: true }),
};

const a = crawlerPort(adapter);

test('create crawler', async () => {
  const result = await a.upsert(crawlerJob);
  assert(result.ok);
});

test('run crawler', async () => {
  const result = await a.start({
    app: 'app',
    name: 'name',
  });
  assert(result.ok);
});

test('get crawler', async () => {
  const result = await a.get({
    app: 'app',
    name: 'name',
  });
  equal(result, crawlerJob);
});

test('delete crawler', async () => {
  const result = await a.delete({
    app: 'app',
    name: 'name',
  });
  assert(result.ok);
});
