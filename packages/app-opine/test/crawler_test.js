// TODO: Tyler. Probably better way to do this
import { crocks } from '../deps.js';
import { assert, assertEquals, superdeno } from '../dev_deps.js';

import build from '../mod.js';

Deno.env.set('DENO_ENV', 'test');

const app = build({
  crawler: {
    remove: (bucket, name) => crocks.Async.Resolved({ ok: true, bucket, name }),
    get: (bucket, name) =>
      crocks.Async.Resolved({
        id: 'test-spider',
        app: 'test',
        source: 'https://example.com',
        depth: 2,
        script: '',
        target: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          sub: '1234',
          aud: 'https://example.com',
          secret: 'secret',
        },
        notify: 'https://example.com',
        bucket,
        name,
      }),
    start: (bucket, name) => crocks.Async.Resolved({ ok: true, bucket, name }),
    upsert: ({ app, name }) => crocks.Async.Resolved({ ok: true, bucket: app, name }),
  },
  middleware: [],
});

Deno.test('crawler', async (t) => {
  await t.step('GET /crawler/:bucket/:name', async (t) => {
    await t.step('GET /crawler/test/spider', async () => {
      const res = await superdeno(app)
        .get('/crawler/test/spider')
        .send();

      assertEquals(res.body.id, 'test-spider');
      assertEquals(res.body.bucket, 'test');
      assertEquals(res.body.name, 'spider');
    });
  });

  await t.step('DELETE /crawler/:bucket/:name', async (t) => {
    await t.step('should pass the correct values', async () => {
      const res = await superdeno(app)
        .delete('/crawler/test/spider')
        .send();

      assert(res.body.ok);
      assertEquals(res.body.bucket, 'test');
      assertEquals(res.body.name, 'spider');
    });
  });

  await t.step('POST /crawler/:bucket/:name/_start', async (t) => {
    await t.step('should pass the correct values', async () => {
      const res = await superdeno(app)
        .post('/crawler/test/spider/_start')
        .send();

      assert(res.body.ok);
      assertEquals(res.body.bucket, 'test');
      assertEquals(res.body.name, 'spider');
    });
  });

  await t.step('PUT /crawler/:bucket/:name', async () => {
    const res = await superdeno(app)
      .put('/crawler/test/spider')
      .set('Content-Type', 'application/json')
      .send({
        source: 'https://example.com',
        depth: 2,
        script: '',
        target: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          sub: '1234',
          aud: 'https://example.com',
          secret: 'secret',
        },
        notify: 'https://example.com',
      });

    assertEquals(res.body.ok, true);
    assertEquals(res.body.bucket, 'test');
    assertEquals(res.body.name, 'spider');
  });
});
