import { superdeno } from 'https://deno.land/x/superdeno@4.8.0/mod.ts';
import { main } from './main.js';

const test = Deno.test;

test({
  name: 'GET /',
  async fn() {
    const app = await main({
      middleware: [
        (app) => app.get('/foobar', (_req, res) => res.json({ ok: true })),
      ],
    });

    await superdeno(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

test({
  name: 'with middleware: GET /foobar',
  async fn() {
    const app = await main({
      middleware: [
        (app) => app.get('/foobar', (_req, res) => res.json({ ok: true })),
      ],
    });

    await superdeno(app)
      .get('/foobar')
      .expect('Content-Type', /json/)
      .expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
